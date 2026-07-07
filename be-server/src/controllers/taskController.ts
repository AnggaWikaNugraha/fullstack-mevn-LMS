import { Response, NextFunction } from 'express';
import Lesson from '../models/Lesson';
import TaskSubmission from '../models/TaskSubmission';
import Progress from '../models/Progress';
import { AuthRequest } from '../middlewares/authMiddleware';

// ─── Submit Task ──────────────────────────────────────────────────────────────
// Auto-approve: Progress langsung dibuat saat submit

export const submitTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { lessonId } = req.params;
    const { submission_url, note = '' } = req.body as { submission_url: string; note?: string };

    if (!submission_url) {
      res.status(400).json({ success: false, message: 'submission_url wajib diisi.' });
      return;
    }

    // Validasi format URL
    try {
      new URL(submission_url);
    } catch {
      res.status(400).json({ success: false, message: 'submission_url tidak valid.' });
      return;
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson || lesson.type !== 'task') {
      res.status(404).json({ success: false, message: 'Task lesson not found.' });
      return;
    }

    // Upsert submission — aman dipanggil berkali-kali
    const submission = await TaskSubmission.findOneAndUpdate(
      { userId: req.userId, lessonId },
      {
        userId: req.userId,
        lessonId,
        courseId: lesson.courseId,
        submission_url,
        note,
        status: 'submitted',
        submittedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Auto-approve: langsung buat Progress
    await Progress.findOneAndUpdate(
      { userId: req.userId, lessonId },
      { userId: req.userId, lessonId, courseId: lesson.courseId, completedAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, data: { submission } });
  } catch (err) {
    next(err);
  }
};

// ─── Submission Milik User ────────────────────────────────────────────────────

export const getMySubmission = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { lessonId } = req.params;

    const submission = await TaskSubmission.findOne({ userId: req.userId, lessonId });

    res.status(200).json({
      success: true,
      data: { submission: submission ?? null },
    });
  } catch (err) {
    next(err);
  }
};
