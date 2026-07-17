import { Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthRequest } from './authMiddleware';

export const adminOnly = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const user = await User.findById(req.userId).select('role');
  if (!user || user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Forbidden. Admin only.' });
    return;
  }
  next();
};
