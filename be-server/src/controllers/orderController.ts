import { Response, NextFunction } from 'express';
import Order from '../models/Order';
import { AuthRequest } from '../middlewares/authMiddleware';

// ─── Riwayat Pembelian ────────────────────────────────────────────────────────
// Berisi order course dan bootcamp sekaligus, dibedakan lewat field type

export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawOrders = await Order.find({ userId: req.userId })
      .populate('courseId', 'title cover_url')
      .populate({
        path: 'batchId',
        select: 'title package_type packageId',
        populate: { path: 'packageId', select: 'title image_url' },
      })
      .sort({ createdAt: -1 });

    // Buang order orphan — course atau batch-nya sudah dihapus setelah order dibuat.
    // Yang diperiksa hanya ref milik type-nya sendiri, sebab order bootcamp
    // memang tidak punya courseId dan sebaliknya.
    const orders = rawOrders.filter((o) =>
      o.type === 'bootcamp' ? o.batchId != null : o.courseId != null
    );

    res.status(200).json({ success: true, data: { orders } });
  } catch (err) {
    next(err);
  }
};
