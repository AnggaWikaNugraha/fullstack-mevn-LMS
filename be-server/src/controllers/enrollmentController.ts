import { Response, NextFunction } from 'express';
import Enrollment from '../models/Enrollment';
import Progress from '../models/Progress';
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

// ─── Daftar Kurs yang Sudah Dibeli ───────────────────────────────────────────
// Mengembalikan semua kurs yang user sudah enroll, disertai progress belajar

export const getMyCourses = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const enrollments = await Enrollment.find({ userId: req.userId })
      .populate('courseId')
      .sort({ enrolledAt: -1 });

    // Hitung completed lessons per course dari tabel Progress
    // Filter enrollment orphan (courseId null setelah populate, misalnya course sudah di-reseed)
    const validEnrollments = enrollments.filter((e) => e.courseId != null);

    const courses = await Promise.all(
      validEnrollments.map(async (e) => {
        const completedLessons = await Progress.countDocuments({
          userId: req.userId,
          courseId: e.courseId,
        });

        return {
          enrollment_id: e._id,
          enrolled_at: e.enrolledAt,
          course: e.courseId,
          completed_lessons: completedLessons,
        };
      })
    );

    res.status(200).json({ success: true, data: { courses } });
  } catch (err) {
    next(err);
  }
};

