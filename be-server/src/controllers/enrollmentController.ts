import { Response, NextFunction } from 'express';
import Enrollment from '../models/Enrollment';
import { AuthRequest } from '../middlewares/authMiddleware';

// ─── Cek Status Enrollment ────────────────────────────────────────────────────
// Dipakai FE untuk polling setelah pembayaran dan untuk gate di CourseDetailView

export const checkEnrollment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({ userId: req.userId, courseId });

    res.status(200).json({
      success: true,
      data: {
        isEnrolled: !!enrollment,
        enrolledAt: enrollment?.enrolledAt ?? null,
      },
    });
  } catch (err) {
    next(err);
  }
};

