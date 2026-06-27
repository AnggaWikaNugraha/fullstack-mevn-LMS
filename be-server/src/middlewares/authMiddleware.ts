import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Session from '../models/Session';

export interface AuthRequest extends Request {
  userId?: string;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  // Step 1 — Extract Bearer token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ success: false, message: 'Access token is required.' });
    return;
  }

  // Step 2 — Verify token signature and expiry
  let decoded: { id: string };
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired access token.' });
    return;
  }

  // Step 3 — Confirm an active session still exists in DB for this user
  // This handles cases where user was logged out remotely (e.g., password reset)
  const deviceId = req.headers['x-device-id'] as string;
  const session = await Session.findOne({ userId: decoded.id, deviceId });
  if (!session) {
    res.status(401).json({ success: false, message: 'Session not found. Please log in again.' });
    return;
  }

  // Attach userId to request so controllers can access it
  req.userId = decoded.id;
  next();
};
