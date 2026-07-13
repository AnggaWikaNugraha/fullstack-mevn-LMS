import { Response, NextFunction } from 'express';
import Order from '../models/Order';
import { AuthRequest } from '../middlewares/authMiddleware';

// ─── Riwayat Pembelian ────────────────────────────────────────────────────────

export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawOrders = await Order.find({ userId: req.userId })
      .populate('courseId', 'title cover_url')
      .sort({ createdAt: -1 });

    // Filter order orphan (courseId null setelah populate)
    const orders = rawOrders.filter((o) => o.courseId != null);

    res.status(200).json({ success: true, data: { orders } });
  } catch (err) {
    next(err);
  }
};
