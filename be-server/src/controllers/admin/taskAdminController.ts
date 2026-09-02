import { Response, NextFunction } from 'express';
import TaskSubmission from '../../models/TaskSubmission';
import Progress from '../../models/Progress';
import { AuthRequest } from '../../middlewares/authMiddleware';

// ─── Daftar semua submission ─────────────────────────────────────────────────

export const listSubmissions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, page = '1', limit = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const filter = status ? { status } : {};

    const [submissions, total] = await Promise.all([
      TaskSubmission.find(filter)
        .populate('userId', 'name email avatar_url')
        .populate('lessonId', 'title type')
        .populate('courseId', 'title')
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      TaskSubmission.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        submissions,
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

// ─── Detail satu submission ──────────────────────────────────────────────────

export const getSubmissionDetail = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Lesson di-populate berikut chapter dan module-nya agar admin melihat
    // konteks lengkap: soal tugas + posisi lesson di dalam kurikulum kursus
    const submission = await TaskSubmission.findById(id)
      .populate('userId', 'name email avatar_url')
      .populate({
        path: 'lessonId',
        select: 'title type description order chapterId',
        populate: {
          path: 'chapterId',
          select: 'title order moduleId',
          populate: { path: 'moduleId', select: 'title order' },
        },
      })
      .populate('courseId', 'title cover_url level topic_name');

    if (!submission) {
      res.status(404).json({ success: false, message: 'Submission tidak ditemukan.' });
      return;
    }

    // Riwayat tugas lain milik peserta yang sama di kursus ini — bahan pertimbangan review
    const history = await TaskSubmission.find({
      userId: submission.userId,
      courseId: submission.courseId,
      _id: { $ne: submission._id },
    })
      .populate('lessonId', 'title')
      .select('lessonId status submittedAt')
      .sort({ submittedAt: -1 })
      .limit(10);

    res.status(200).json({ success: true, data: { submission, history } });
  } catch (err) {
    next(err);
  }
};

// ─── Review submission (approve / reject) ────────────────────────────────────

export const reviewSubmission = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body as { status: string; feedback?: string };

    if (!['approved', 'rejected'].includes(status)) {
      res.status(400).json({ success: false, message: 'status harus "approved" atau "rejected".' });
      return;
    }

    const submission = await TaskSubmission.findById(id);
    if (!submission) {
      res.status(404).json({ success: false, message: 'Submission tidak ditemukan.' });
      return;
    }

    if (status === 'approved') {
      // Buat Progress agar lesson dianggap selesai
      await Progress.findOneAndUpdate(
        { userId: submission.userId, lessonId: submission.lessonId },
        {
          userId: submission.userId,
          lessonId: submission.lessonId,
          courseId: submission.courseId,
          completedAt: new Date(),
        },
        { upsert: true, new: true }
      );
      submission.status = 'approved';
      submission.feedback = feedback ?? null;
    } else {
      // Hapus Progress agar lesson kembali belum selesai
      await Progress.deleteOne({ userId: submission.userId, lessonId: submission.lessonId });
      submission.status = 'rejected';
      submission.feedback = feedback ?? null;
    }

    await submission.save();

    res.status(200).json({ success: true, data: { submission } });
  } catch (err) {
    next(err);
  }
};
