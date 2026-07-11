import { Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middlewares/authMiddleware';

// ─── Get Profile ─────────────────────────────────────────────────────────────

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
      return;
    }

    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

// ─── Update Profile ───────────────────────────────────────────────────────────

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, avatar_url } = req.body as { name?: string; avatar_url?: string };

    if (!name || name.trim().length < 2) {
      res.status(400).json({ success: false, message: 'Nama minimal 2 karakter.' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name: name.trim(), ...(avatar_url !== undefined && { avatar_url }) },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

// ─── Change Password ──────────────────────────────────────────────────────────

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    };

    if (!currentPassword || !newPassword || !confirmPassword) {
      res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ success: false, message: 'Password baru minimal 8 karakter.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Konfirmasi password tidak cocok.' });
      return;
    }

    // Gunakan select('+password') karena password tidak di-include secara default
    const user = await User.findById(req.userId).select('+password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
      return;
    }

    // Akun Google-only tidak punya password
    if (!user.password) {
      res.status(400).json({ success: false, message: 'Akun Google tidak dapat mengubah password.' });
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Password saat ini tidak sesuai.' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password berhasil diubah.' });
  } catch (err) {
    next(err);
  }
};
