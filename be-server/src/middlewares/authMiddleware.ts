import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Session from '../models/Session';

export interface AuthRequest extends Request {
  userId?: string;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  // Langkah 1 — Ambil Bearer token dari header Authorization
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ success: false, message: 'Access token is required.' });
    return;
  }

  // Langkah 2 — Verifikasi signature dan masa berlaku token
  let decoded: { id: string };
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired access token.' });
    return;
  }

  // Langkah 3 — Pastikan sesi aktif masih ada di DB untuk user ini
  // Menangani kasus user di-logout dari perangkat lain (misal: reset password)
  const deviceId = req.headers['x-device-id'] as string;
  const session = await Session.findOne({ userId: decoded.id, deviceId });
  if (!session) {
    res.status(401).json({ success: false, message: 'Session not found. Please log in again.' });
    return;
  }

  // Pasang userId ke request agar controller bisa mengaksesnya
  req.userId = decoded.id;
  next();
};

// Sama seperti protect, tapi request tanpa token tetap diteruskan.
// Controller cek req.userId untuk menentukan apakah user sudah login.
export const optionalProtect = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const deviceId = req.headers['x-device-id'] as string;
    const session = await Session.findOne({ userId: decoded.id, deviceId });
    if (session) req.userId = decoded.id;
  } catch {
    // Token tidak valid di endpoint opsional — lanjut sebagai unauthenticated
  }
  next();
};
