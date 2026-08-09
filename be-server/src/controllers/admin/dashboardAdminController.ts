import { Response, NextFunction } from 'express';
import User from '../../models/User';
import Course from '../../models/Course';
import Order from '../../models/Order';
import Enrollment from '../../models/Enrollment';
import { AuthRequest } from '../../middlewares/authMiddleware';

// Semua pengelompokan waktu memakai jam WIB, bukan UTC bawaan MongoDB.
// Tanpa ini pembayaran pukul 06:00 WIB tanggal 1 akan terhitung di bulan sebelumnya.
const TIMEZONE = 'Asia/Jakarta';

// WIB tetap UTC+7 sepanjang tahun, tidak ada penyesuaian musim
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

// Mengubah waktu dinding WIB menjadi Date UTC yang setara, untuk dipakai di $match
function wibToUtc(year: number, monthIndex: number, day = 1): Date {
  return new Date(Date.UTC(year, monthIndex, day) - WIB_OFFSET_MS);
}

// Tahun dan bulan saat ini menurut jam WIB, bukan zona waktu server
function nowInWib(): { year: number; monthIndex: number } {
  const wib = new Date(Date.now() + WIB_OFFSET_MS);
  return { year: wib.getUTCFullYear(), monthIndex: wib.getUTCMonth() };
}

// Menjumlahkan amount dari order berstatus paid, dengan penyaring tambahan opsional.
// Dihitung di sisi basis data agar tidak perlu menarik seluruh order ke memori.
async function sumPaidAmount(extraMatch: Record<string, unknown> = {}): Promise<number> {
  const [row] = await Order.aggregate<{ total: number }>([
    { $match: { status: 'paid', ...extraMatch } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return row?.total ?? 0;
}

// ─── Statistik Ringkas Dashboard ──────────────────────────────────────────────

export const getDashboardStats = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { year, monthIndex } = nowInWib();
    const awalBulanIni = wibToUtc(year, monthIndex);

    const [
      totalUsers,
      newUsersThisMonth,
      publishedCourses,
      draftCourses,
      totalEnrollments,
      revenueAllTime,
      revenueThisMonth,
      rawRecentOrders,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: awalBulanIni } }),
      Course.countDocuments({ status: 'published' }),
      Course.countDocuments({ status: 'draft' }),
      Enrollment.countDocuments(),
      sumPaidAmount(),
      sumPaidAmount({ paidAt: { $gte: awalBulanIni } }),
      Order.find({ status: 'paid' })
        .select('amount paidAt userId courseId')
        .populate('userId', 'name email avatar_url')
        .populate('courseId', 'title cover_url')
        .sort({ paidAt: -1 })
        .limit(5),
    ]);

    // Course atau user bisa hilang bila dokumennya dihapus setelah order dibuat,
    // misalnya karena seeder dijalankan ulang. Order tetap ditampilkan dengan label
    // pengganti supaya daftar ini tidak bertentangan dengan angka total di atas.
    const recentOrders = rawRecentOrders.map((o) => {
      const course = o.courseId as unknown as { _id: string; title: string; cover_url: string } | null;
      const user = o.userId as unknown as { _id: string; name: string; email: string; avatar_url: string | null } | null;

      return {
        _id: o._id,
        amount: o.amount,
        paidAt: o.paidAt,
        course: course ?? { _id: null, title: '(course telah dihapus)', cover_url: null },
        user: user ?? { _id: null, name: '(user telah dihapus)', email: '', avatar_url: null },
      };
    });

    res.status(200).json({
      success: true,
      data: {
        users: { total: totalUsers, newThisMonth: newUsersThisMonth },
        courses: { published: publishedCourses, draft: draftCourses },
        enrollments: { total: totalEnrollments },
        revenue: { allTime: revenueAllTime, thisMonth: revenueThisMonth },
        recentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Laporan Pendapatan ───────────────────────────────────────────────────────
// Cakupannya hanya penjualan course. Bootcamp belum punya alur checkout,
// jadi tidak ada order yang merujuk ke bootcamp sama sekali.

export const getRevenueReport = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { year: currentYear } = nowInWib();

    const parsedYear = parseInt(req.query.year as string);
    const year = Number.isInteger(parsedYear) && parsedYear >= 2000 && parsedYear <= currentYear + 1
      ? parsedYear
      : currentYear;

    const awalTahun = wibToUtc(year, 0);
    const awalTahunDepan = wibToUtc(year + 1, 0);
    const rentangTahun = { $gte: awalTahun, $lt: awalTahunDepan };

    const [rawSeries, rawTopCourses, [summaryRow], statusCounts, rawYears] = await Promise.all([
      // Pendapatan per bulan
      Order.aggregate<{ _id: string; total: number; orders: number }>([
        { $match: { status: 'paid', paidAt: rentangTahun } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$paidAt', timezone: TIMEZONE } },
            total: { $sum: '$amount' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Lima course dengan pendapatan terbesar
      Order.aggregate([
        { $match: { status: 'paid', paidAt: rentangTahun } },
        { $group: { _id: '$courseId', revenue: { $sum: '$amount' }, sold: { $sum: 1 } } },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
        // Course yang sudah dihapus tetap ditampilkan agar total tidak bocor
        { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            courseId: '$_id',
            title: { $ifNull: ['$course.title', '(course telah dihapus)'] },
            cover_url: { $ifNull: ['$course.cover_url', null] },
            revenue: 1,
            sold: 1,
          },
        },
      ]),

      // Total dan jumlah order terbayar sepanjang tahun
      Order.aggregate<{ total: number; orders: number }>([
        { $match: { status: 'paid', paidAt: rentangTahun } },
        { $group: { _id: null, total: { $sum: '$amount' }, orders: { $sum: 1 } } },
      ]),

      // Sebaran status untuk menghitung tingkat konversi.
      // Dasarnya createdAt, sebab order pending tidak punya paidAt.
      Order.aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: rentangTahun } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // Tahun yang benar-benar punya transaksi, untuk mengisi pemilih tahun di FE
      Order.aggregate<{ _id: number }>([
        { $match: { status: 'paid', paidAt: { $ne: null } } },
        { $group: { _id: { $year: { date: '$paidAt', timezone: TIMEZONE } } } },
        { $sort: { _id: -1 } },
      ]),
    ]);

    // Agregasi hanya mengembalikan bulan yang ada datanya. Bulan kosong diisi nol
    // supaya grafik di FE selalu menerima 12 titik dan tidak melompati bulan.
    const byPeriod = new Map(rawSeries.map((r) => [r._id, r]));
    const series = Array.from({ length: 12 }, (_, i) => {
      const period = `${year}-${String(i + 1).padStart(2, '0')}`;
      const row = byPeriod.get(period);
      return { period, total: row?.total ?? 0, orders: row?.orders ?? 0 };
    });

    const total = summaryRow?.total ?? 0;
    const paidOrders = summaryRow?.orders ?? 0;

    const ordersByStatus = Object.fromEntries(statusCounts.map((s) => [s._id, s.count]));
    const createdOrders = statusCounts.reduce((acc, s) => acc + s.count, 0);

    // Tahun berjalan selalu ikut ditawarkan walau belum ada transaksi
    const years = rawYears.map((y) => y._id);
    const availableYears = years.includes(currentYear) ? years : [currentYear, ...years];

    res.status(200).json({
      success: true,
      data: {
        year,
        availableYears,
        series,
        topCourses: rawTopCourses,
        summary: {
          total,
          paidOrders,
          avgOrderValue: paidOrders ? Math.round(total / paidOrders) : 0,
          conversionRate: createdOrders ? (ordersByStatus.paid ?? 0) / createdOrders : 0,
          ordersByStatus,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
