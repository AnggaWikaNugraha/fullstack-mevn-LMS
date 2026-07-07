import { Response, NextFunction } from 'express';
import Lesson from '../models/Lesson';
import QuizQuestion from '../models/QuizQuestion';
import QuizAttempt from '../models/QuizAttempt';
import Progress from '../models/Progress';
import { AuthRequest } from '../middlewares/authMiddleware';

// ─── Ambil Soal Quiz ──────────────────────────────────────────────────────────
// correct_index tidak pernah disertakan dalam response

export const getQuestions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson || lesson.type !== 'quiz') {
      res.status(404).json({ success: false, message: 'Quiz lesson not found.' });
      return;
    }

    const questions = await QuizQuestion
      .find({ lessonId })
      .select('-correct_index') // jangan pernah kirim jawaban ke FE
      .sort({ order: 1 });

    if (questions.length === 0) {
      res.status(400).json({ success: false, message: 'Quiz belum memiliki soal.' });
      return;
    }

    res.status(200).json({ success: true, data: { questions } });
  } catch (err) {
    next(err);
  }
};

// ─── Submit Jawaban Quiz ──────────────────────────────────────────────────────
// Hitung skor di server — bukan di client

export const submitAnswers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { lessonId } = req.params;
    const { answers } = req.body as { answers: number[] };

    if (!Array.isArray(answers)) {
      res.status(400).json({ success: false, message: 'answers harus berupa array.' });
      return;
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson || lesson.type !== 'quiz') {
      res.status(404).json({ success: false, message: 'Quiz lesson not found.' });
      return;
    }

    // Ambil soal dengan correct_index untuk pengecekan
    const questions = await QuizQuestion.find({ lessonId }).sort({ order: 1 });

    if (questions.length === 0) {
      res.status(400).json({ success: false, message: 'Quiz belum memiliki soal.' });
      return;
    }

    if (answers.length !== questions.length) {
      res.status(400).json({
        success: false,
        message: `Jumlah jawaban (${answers.length}) tidak sesuai jumlah soal (${questions.length}).`,
      });
      return;
    }

    // Hitung skor
    let correctCount = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correct_index) correctCount++;
    }

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= lesson.passing_score;

    // Simpan attempt
    const attempt = await QuizAttempt.create({
      userId: req.userId,
      lessonId,
      courseId: lesson.courseId,
      answers,
      score,
      passed,
      attemptedAt: new Date(),
    });

    // Buat Progress hanya jika lulus
    if (passed) {
      await Progress.findOneAndUpdate(
        { userId: req.userId, lessonId },
        { userId: req.userId, lessonId, courseId: lesson.courseId, completedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: {
        attempt: {
          _id: attempt._id,
          score,
          passed,
          total_questions: questions.length,
          correct_count: correctCount,
          passing_score: lesson.passing_score,
          attemptedAt: attempt.attemptedAt,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Attempt Terakhir User ────────────────────────────────────────────────────

export const getMyAttempt = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { lessonId } = req.params;

    const attempt = await QuizAttempt
      .findOne({ userId: req.userId, lessonId })
      .sort({ attemptedAt: -1 }); // ambil yang paling baru

    if (!attempt) {
      res.status(200).json({ success: true, data: { attempt: null } });
      return;
    }

    const totalQuestions = await QuizQuestion.countDocuments({ lessonId });

    res.status(200).json({
      success: true,
      data: {
        attempt: {
          _id: attempt._id,
          score: attempt.score,
          passed: attempt.passed,
          total_questions: totalQuestions,
          correct_count: Math.round((attempt.score / 100) * totalQuestions),
          attemptedAt: attempt.attemptedAt,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
