import { Response, NextFunction } from 'express';
import Order from '../models/Order';
import { AuthRequest } from '../middlewares/authMiddleware';

// ─── Riwayat Pembelian ────────────────────────────────────────────────────────

export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('courseId', 'title cover_url')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { orders } });
  } catch (err) {
    next(err);
  }
};
