import { Response, NextFunction } from 'express';
import { RtcTokenBuilder, RtcRole } from 'agora-token';
import BootcampSession from '../models/BootcampSession';
import BootcampBatch from '../models/BootcampBatch';
import BootcampPackage from '../models/BootcampPackage';
import BootcampEnrollment from '../models/BootcampEnrollment';
import LiveSessionUsage from '../models/LiveSessionUsage';
import User from '../models/User';
import { AuthRequest } from '../middlewares/authMiddleware';
import { startOfCurrentWibMonth } from '../utils/wib';

// Token hanya perlu bertahan selama sesi berlangsung; 1 jam sudah cukup longgar
const TOKEN_TTL_SECONDS = 60 * 60;

// Sisakan jarak dari kuota gratis Agora yang sebenarnya (10.000 menit/bulan),
// sebab estimasi di sini tidak akan sama persis dengan hitungan Agora
const DEFAULT_MONTHLY_BUDGET = 8000;

function monthlyBudget(): number {
  const parsed = parseInt(process.env.AGORA_MONTHLY_MINUTE_BUDGET ?? '');
  return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_MONTHLY_BUDGET;
}

// Agora menuntut uid berupa uint32. ObjectId terlalu panjang, jadi dipakai 8 hex
// terakhirnya — stabil untuk user yang sama sehingga rejoin tidak berganti uid.
function objectIdToUid(id: string): number {
  return parseInt(id.slice(-8), 16);
}

// "HH:mm" → menit sejak tengah malam
function toMinutes(clock: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(clock ?? '');
  if (!match) return null;
  return parseInt(match[1]) * 60 + parseInt(match[2]);
}

// Durasi terjadwal satu sesi. Dipakai sebagai estimasi pemakaian karena kapan
// user menutup tab tidak pernah bisa diketahui pasti — untuk sebuah rem,
// menaksir lebih tinggi justru arah yang benar.
function sessionDurationMinutes(start: string, end: string): number {
  const from = toMinutes(start);
  const to = toMinutes(end);
  if (from === null || to === null || to <= from) return 60; // jadwal tak wajar → asumsi 1 jam
  return to - from;
}

// ─── Pemakaian menit bulan berjalan ──────────────────────────────────────────

async function usedMinutesThisMonth(): Promise<number> {
  const [row] = await LiveSessionUsage.aggregate<{ total: number }>([
    { $match: { createdAt: { $gte: startOfCurrentWibMonth() } } },
    { $group: { _id: null, total: { $sum: '$minutes' } } },
  ]);
  return row?.total ?? 0;
}

// ─── Token RTC untuk satu sesi ───────────────────────────────────────────────

export const getSessionToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    if (!appId || !appCertificate) {
      res.status(503).json({ success: false, message: 'Live session belum dikonfigurasi di server.' });
      return;
    }

    // Tipe Express memberi string | string[]; nama kanal Agora harus string tunggal
    const sessionId = String(req.params.sessionId);

    const session = await BootcampSession.findById(sessionId);
    if (!session) {
      res.status(404).json({ success: false, message: 'Sesi tidak ditemukan.' });
      return;
    }

    const batch = await BootcampBatch.findById(session.batchId).select('packageId');
    if (!batch) {
      res.status(404).json({ success: false, message: 'Batch pemilik sesi ini sudah tidak ada.' });
      return;
    }

    // Mentor menempel di package, bukan batch — rantainya sesi → batch → package
    const pkg = await BootcampPackage.findById(batch.packageId).select('mentors');
    const isMentor = !!pkg?.mentors.some((m) => m.userId.toString() === req.userId);

    // Admin boleh masuk sebagai pengawas tanpa enrollment maupun status mentor
    const user = await User.findById(req.userId).select('role');
    const isAdmin = user?.role === 'admin';

    // Mentor dan admin boleh masuk tanpa enrollment; peserta wajib terdaftar
    if (!isMentor && !isAdmin) {
      const enrollment = await BootcampEnrollment.findOne({ userId: req.userId, batchId: session.batchId });
      if (!enrollment) {
        res.status(403).json({ success: false, message: 'Kamu belum terdaftar di batch bootcamp ini.' });
        return;
      }
    }

    // Mentor tetap didahulukan: admin yang kebetulan juga mentor tampil sebagai mentor
    const participantRole = isMentor ? 'host' : isAdmin ? 'admin' : 'participant';

    const minutes = sessionDurationMinutes(session.session_start_time, session.session_end_time);

    // Baris yang sudah ada berarti user pernah masuk sesi ini — menitnya sudah
    // dipesan, jadi rejoin tidak menambah pemakaian dan tidak perlu dicek kuota
    const existing = await LiveSessionUsage.findOne({ userId: req.userId, sessionId });
    if (!existing) {
      const budget = monthlyBudget();
      const used = await usedMinutesThisMonth();
      if (used + minutes > budget) {
        res.status(403).json({
          success: false,
          message: 'Kuota live session bulan ini sudah habis. Hubungi admin.',
        });
        return;
      }
      await LiveSessionUsage.create({ userId: req.userId, sessionId, minutes });
    }

    const uid = objectIdToUid(req.userId as string);

    // Keduanya PUBLISHER: peserta kelas tetap perlu bisa bertanya. Bedanya ada
    // di kewenangan moderasi, yang ditentukan `role` di bawah.
    //
    // tokenExpire dan privilegeExpire sama-sama berupa DURASI detik dari
    // sekarang, bukan timestamp absolut. Mengisinya dengan epoch membuat
    // privilege melewati batas 24 jam milik Agora dan token ditolak gateway
    // dengan CAN_NOT_GET_GATEWAY_SERVER "invalid token".
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      sessionId,           // nama kanal = _id sesi, unik tanpa perlu field baru
      uid,
      RtcRole.PUBLISHER,
      TOKEN_TTL_SECONDS,
      TOKEN_TTL_SECONDS
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        appId,
        channelName: sessionId,
        uid,
        // Peran ditentukan server agar FE tidak perlu menebak dari User.role —
        // status host itu per sesi, bukan sifat global user
        role: participantRole,
        session: {
          _id: session._id,
          title: session.title,
          session_name: session.session_name,
          session_date: session.session_date,
          session_start_time: session.session_start_time,
          session_end_time: session.session_end_time,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Sisa kuota untuk pantauan admin ─────────────────────────────────────────

export const getLiveUsage = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const budget = monthlyBudget();
    const used = await usedMinutesThisMonth();

    res.status(200).json({
      success: true,
      data: {
        budget,
        used,
        remaining: Math.max(0, budget - used),
        percentage: budget > 0 ? Math.min(100, Math.round((used / budget) * 100)) : 0,
        monthStart: startOfCurrentWibMonth(),
      },
    });
  } catch (err) {
    next(err);
  }
};
