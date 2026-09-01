import { Response, NextFunction } from 'express';
import User from '../../models/User';
import Enrollment from '../../models/Enrollment';
import Order from '../../models/Order';
import { AuthRequest } from '../../middlewares/authMiddleware';

// ─── Daftar semua user ───────────────────────────────────────────────────────

export const listUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, page = '1', limit = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const filter = search
      ? {
          $or: [
            { name: { $regex: search as string, $options: 'i' } },
            { email: { $regex: search as string, $options: 'i' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('name email role avatar_url isVerified createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Detail user ──────────────────────────────────────────────────────────────

export const getUserDetail = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('name email role avatar_url isVerified createdAt');
    if (!user) {
      res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
      return;
    }

    const [enrollments, orders] = await Promise.all([
      Enrollment.find({ userId: id })
        .populate('courseId', 'title cover_url level topic_name')
        .sort({ enrolledAt: -1 }),
      // Order bootcamp ikut ditarik: total_spent di bawah menjumlahkan semua order
      // lunas, jadi daftarnya harus memuat keduanya agar angkanya tidak berbeda
      Order.find({ userId: id })
        .populate('courseId', 'title cover_url')
        .populate({
          path: 'batchId',
          select: 'title packageId',
          populate: { path: 'packageId', select: 'title image_url' },
        })
        .sort({ createdAt: -1 }),
    ]);

    const total_spent = orders
      .filter((o) => o.status === 'paid')
      .reduce((sum, o) => sum + o.amount, 0);

    res.status(200).json({
      success: true,
      data: { user, enrollments, orders, total_spent },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Ubah role user ──────────────────────────────────────────────────────────

export const updateUserRole = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowed = ['student', 'instructor', 'admin', 'mentor'];
    if (!role || !allowed.includes(role)) {
      res.status(400).json({ success: false, message: `role harus salah satu dari: ${allowed.join(', ')}.` });
      return;
    }

    // Admin tidak bisa mengubah role dirinya sendiri
    if (id === req.userId) {
      res.status(400).json({ success: false, message: 'Admin tidak dapat mengubah role dirinya sendiri.' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, select: 'name email role avatar_url isVerified createdAt' }
    );

    if (!user) {
      res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
      return;
    }

    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};
