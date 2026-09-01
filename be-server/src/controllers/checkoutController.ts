import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import midtransClient from 'midtrans-client';
import Course from '../models/Course';
import Order, { IOrder } from '../models/Order';
import Enrollment from '../models/Enrollment';
import BootcampPackage from '../models/BootcampPackage';
import BootcampBatch from '../models/BootcampBatch';
import BootcampEnrollment from '../models/BootcampEnrollment';
import { AuthRequest } from '../middlewares/authMiddleware';

// Inisialisasi Midtrans Snap — server key tidak pernah dikirim ke FE
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY as string,
  clientKey: process.env.MIDTRANS_CLIENT_KEY as string,
});

// Buat order ID unik — max 50 karakter untuk Midtrans
function generateMidtransOrderId(): string {
  return `ORD-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
}

// ─── Pemberian Akses Setelah Lunas ────────────────────────────────────────────
// Dipakai bersama oleh webhook dan verifikasi manual. Keduanya bisa berjalan
// untuk order yang sama, jadi semua penulisan di sini harus idempotent.

async function grantAccess(order: IOrder): Promise<void> {
  if (order.type === 'bootcamp') {
    const batch = await BootcampBatch.findById(order.batchId);
    // Batch bisa saja sudah dihapus admin setelah order dibuat — order tetap
    // ditandai lunas, tapi tidak ada enrollment yang bisa dibuat
    if (!batch) return;

    await BootcampEnrollment.findOneAndUpdate(
      { userId: order.userId, batchId: order.batchId },
      {
        userId: order.userId,
        packageId: batch.packageId,
        batchId: order.batchId,
        orderId: order._id,
        enrolledAt: new Date(),
      },
      { upsert: true, new: true }
    );
    return;
  }

  await Enrollment.findOneAndUpdate(
    { userId: order.userId, courseId: order.courseId },
    { userId: order.userId, courseId: order.courseId, orderId: order._id, enrolledAt: new Date() },
    { upsert: true, new: true }
  );
}

// Menerjemahkan status transaksi Midtrans ke status order kita, lalu menyimpannya.
// Dipakai bersama oleh webhook dan verifikasi manual agar aturannya tidak bercabang dua.
async function syncOrderStatus(
  order: IOrder,
  transaction_status: string,
  fraud_status?: string
): Promise<void> {
  const isPaid =
    transaction_status === 'settlement' ||
    (transaction_status === 'capture' && fraud_status === 'accept');

  if (isPaid && order.status !== 'paid') {
    order.status = 'paid';
    order.paidAt = new Date();
    await order.save();
    await grantAccess(order);
  } else if (transaction_status === 'expire') {
    order.status = 'expired';
    await order.save();
  } else if (transaction_status === 'cancel' || transaction_status === 'deny') {
    order.status = 'failed';
    await order.save();
  }
}

// ─── Buat Order Course & Generate Snap Token ─────────────────────────────────

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      res.status(400).json({ success: false, message: 'courseId is required.' });
      return;
    }

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }

    // Course gratis tidak perlu checkout
    if (course.isFree) {
      res.status(400).json({ success: false, message: 'Course ini gratis, tidak perlu checkout.' });
      return;
    }

    // Cegah double purchase jika sudah enrolled
    const existing = await Enrollment.findOne({ userId: req.userId, courseId });
    if (existing) {
      res.status(409).json({ success: false, message: 'Kamu sudah terdaftar di kurs ini.' });
      return;
    }

    // Reuse token jika masih ada order pending yang belum expire
    const pendingOrder = await Order.findOne({ userId: req.userId, courseId, status: 'pending' });
    if (pendingOrder) {
      res.status(200).json({
        success: true,
        data: { snap_token: pendingOrder.snap_token, order_id: pendingOrder.midtrans_order_id },
      });
      return;
    }

    const midtrans_order_id = generateMidtransOrderId();

    // Generate Snap token dari Midtrans
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: midtrans_order_id,
        gross_amount: course.price,
      },
      item_details: [
        {
          id: courseId,
          price: course.price,
          quantity: 1,
          name: course.title.substring(0, 50),
        },
      ],
    } as any);

    // Simpan order ke DB
    const order = await Order.create({
      userId: req.userId,
      type: 'course',
      courseId,
      amount: course.price,
      status: 'pending',
      snap_token: transaction.token,
      midtrans_order_id,
    });

    res.status(201).json({
      success: true,
      data: { snap_token: order.snap_token, order_id: order.midtrans_order_id },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Buat Order Bootcamp & Generate Snap Token ───────────────────────────────
// Order disimpan di koleksi yang sama dengan course, dibedakan lewat field type.

export const createBootcampOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { batchId } = req.body;

    if (!batchId) {
      res.status(400).json({ success: false, message: 'batchId is required.' });
      return;
    }

    const batch = await BootcampBatch.findById(batchId);
    if (!batch) {
      res.status(404).json({ success: false, message: 'Batch not found.' });
      return;
    }

    const bootcampPackage = await BootcampPackage.findById(batch.packageId);
    if (!bootcampPackage) {
      res.status(404).json({ success: false, message: 'Bootcamp not found.' });
      return;
    }

    if (bootcampPackage.status !== 'open') {
      res.status(400).json({ success: false, message: 'Pendaftaran bootcamp ini belum dibuka.' });
      return;
    }

    // Kuota di sini persentase yang diisi admin, bukan hitungan kursi terpakai
    if (batch.quota_used_percentage >= 100) {
      res.status(400).json({ success: false, message: 'Kuota batch ini sudah penuh.' });
      return;
    }

    // Cegah double purchase pada batch yang sama — batch lain tetap boleh dibeli
    const existing = await BootcampEnrollment.findOne({ userId: req.userId, batchId });
    if (existing) {
      res.status(409).json({ success: false, message: 'Kamu sudah terdaftar di batch ini.' });
      return;
    }

    // Reuse token jika user menekan tombol daftar dua kali tanpa membayar
    const pendingOrder = await Order.findOne({
      userId: req.userId,
      type: 'bootcamp',
      batchId,
      status: 'pending',
    });
    if (pendingOrder) {
      res.status(200).json({
        success: true,
        data: { snap_token: pendingOrder.snap_token, order_id: pendingOrder.midtrans_order_id },
      });
      return;
    }

    const midtrans_order_id = generateMidtransOrderId();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: midtrans_order_id,
        gross_amount: batch.price,
      },
      item_details: [
        {
          id: batchId,
          price: batch.price,
          quantity: 1,
          name: `${bootcampPackage.title} - ${batch.title}`.substring(0, 50),
        },
      ],
    } as any);

    const order = await Order.create({
      userId: req.userId,
      type: 'bootcamp',
      batchId,
      amount: batch.price,
      status: 'pending',
      snap_token: transaction.token,
      midtrans_order_id,
    });

    res.status(201).json({
      success: true,
      data: { snap_token: order.snap_token, order_id: order.midtrans_order_id },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Verifikasi Pembayaran ────────────────────────────────────────────────────
// Dipanggil FE setelah onSuccess/onPending dari Snap popup
// Cek status langsung ke Midtrans API — tidak butuh webhook/ngrok
// Melayani order course maupun bootcamp, percabangannya ada di grantAccess

export const verifyPayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ midtrans_order_id: orderId, userId: req.userId });
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    // Tanya langsung ke Midtrans API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const statusResponse = await (snap as any).transaction.status(orderId);
    const { transaction_status, fraud_status } = statusResponse;

    await syncOrderStatus(order, transaction_status, fraud_status);

    res.status(200).json({
      success: true,
      data: {
        payment_status: order.status,
        isEnrolled: order.status === 'paid',
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Webhook Notifikasi Midtrans ───────────────────────────────────────────────
// Endpoint publik — Midtrans yang memanggil, bukan user
// Verifikasi signature_key sebelum proses apapun
// Satu endpoint untuk course dan bootcamp: Midtrans hanya mengizinkan satu
// Notification URL per akun merchant

export const handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = req.body;

    // Verifikasi signature: SHA512(order_id + status_code + gross_amount + server_key)
    const serverKey = process.env.MIDTRANS_SERVER_KEY as string;
    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');

    if (signature_key !== expectedSignature) {
      res.status(400).json({ success: false, message: 'Invalid signature.' });
      return;
    }

    const order = await Order.findOne({ midtrans_order_id: order_id });
    if (!order) {
      // Order tidak ditemukan — tetap return 200 agar Midtrans tidak retry terus
      res.status(200).json({ success: true });
      return;
    }

    await syncOrderStatus(order, transaction_status, fraud_status);

    // Wajib return 200 ke Midtrans agar tidak di-retry
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
