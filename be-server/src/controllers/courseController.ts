import { Request, Response, NextFunction } from 'express';
import Course from '../models/Course';
import Module from '../models/Module';
import Chapter from '../models/Chapter';
import Lesson, { ILesson } from '../models/Lesson';
import Progress from '../models/Progress';
import Enrollment from '../models/Enrollment';
import { AuthRequest } from '../middlewares/authMiddleware';

// ─── Daftar Kurs ──────────────────────────────────────────────────────────────

export const getCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { topic, page = '1', limit = '10' } = req.query;

    const filter: Record<string, unknown> = { status: 'published' };
    if (topic) filter.topic = topic;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, parseInt(limit as string));
    const skip = (pageNum - 1) * limitNum;

    const [courses, total] = await Promise.all([
      Course.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      Course.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        courses,
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

// ─── Daftar Topik ─────────────────────────────────────────────────────────────
// Topik bukan koleksi terpisah — di-aggregate dari field topic + topic_name di Course

export const getTopics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const topics = await Course.aggregate([
      {
        $group: {
          _id: '$topic',
          topic_name: { $first: '$topic_name' },
        },
      },
      {
        $project: {
          _id: 0,
          topic: '$_id',
          topic_name: 1,
        },
      },
      { $sort: { topic: 1 } },
    ]);

    res.status(200).json({ success: true, data: { topics } });
  } catch (err) {
    next(err);
  }
};

// ─── Detail Kurs ──────────────────────────────────────────────────────────────
// Endpoint publik — middleware optionalProtect mengisi req.userId jika token valid.
// is_locked di DB: false = preview gratis (selalu terbuka), true = dikunci oleh progress sequential.

export const getCourseDetail = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }

    // Ambil semua data bersarang secara paralel
    const modules = await Module.find({ courseId: id }).sort({ order: 1 });
    const moduleIds = modules.map((m) => m._id);

    const chapters = await Chapter.find({ moduleId: { $in: moduleIds } }).sort({ order: 1 });
    const chapterIds = chapters.map((c) => c._id);

    const lessons = await Lesson.find({ chapterId: { $in: chapterIds } }).sort({ order: 1 });

    // Cek enrollment hanya untuk course berbayar dan user yang sudah login
    // - course gratis → skip query, semua user bisa akses
    // - belum login (req.userId undefined) → skip query, isEnrolled tetap false
    let isEnrolled = false;
    if (!course.isFree && req.userId) {
      // Cari dokumen enrollment milik user ini untuk course ini
      // findOne mengembalikan objek jika ketemu, null jika tidak ada
      const enrollment = await Enrollment.findOne({ userId: req.userId, courseId: id });
      // !! mengubah objek/null ke boolean: objek → true, null → false
      isEnrolled = !!enrollment;
    }

    // Kumpulkan ID lesson yang sudah diselesaikan user (kosong jika belum login / belum enrolled)
    const doneSet = new Set<string>();
    if (req.userId && (course.isFree || isEnrolled)) {
      const progressRecords = await Progress.find({ userId: req.userId, courseId: id });
      progressRecords.forEach((p) => doneSet.add(p.lessonId.toString()));
    }

    // Hitung is_done dan is_locked per lesson secara berurutan (global order).
    //
    // Gate berlapis:
    //   1. Course berbayar + belum enrolled → semua lesson terkunci (tampilkan CTA beli)
    //   2. is_locked di DB = false → preview gratis, selalu terbuka
    //   3. is_locked di DB = true → cek sequential progress (enrolled atau course gratis)
    let prevDone = true;
    const lessonStatusMap = new Map<string, { is_done: boolean; is_locked: boolean }>();

    // Jika course berbayar dan user belum enrolled, semua lesson dikunci
    const blockedByEnrollment = !course.isFree && !isEnrolled;

    for (const module of modules) {
      const moduleChapters = chapters.filter(
        (c) => c.moduleId.toString() === module._id.toString()
      );
      for (const chapter of moduleChapters) {
        const chapterLessons = lessons.filter(
          (l) => l.chapterId.toString() === chapter._id.toString()
        );
        for (const lesson of chapterLessons) {
          const rawIsDone = req.userId ? doneSet.has(lesson._id.toString()) : false;
          let is_done: boolean;
          let is_locked: boolean;

          if (blockedByEnrollment && lesson.is_locked) {
            // Belum beli course berbayar — lesson locked (kecuali preview gratis)
            is_done = false;
            is_locked = true;
          } else if (!lesson.is_locked) {
            // Lesson preview — selalu terbuka tanpa perlu login atau progress
            is_done = rawIsDone;
            is_locked = false;
            prevDone = rawIsDone;
          } else if (!req.userId) {
            // Lesson berbayar + belum login → wajib login
            is_done = false;
            is_locked = true;
          } else {
            // Lesson berbayar + sudah login + enrolled → cek sequential progress
            is_done = rawIsDone;
            is_locked = !prevDone;
            prevDone = rawIsDone;
          }

          lessonStatusMap.set(lesson._id.toString(), { is_done, is_locked });
        }
      }
    }

    // Susun response bersarang: modul → bab → lesson
    const modulesWithContent = modules.map((module) => {
      const moduleChapters = chapters.filter(
        (c) => c.moduleId.toString() === module._id.toString()
      );

      const chaptersWithLessons = moduleChapters.map((chapter) => {
        const chapterLessons = lessons
          .filter((l) => l.chapterId.toString() === chapter._id.toString())
          .map((lesson) => {
            const status = lessonStatusMap.get(lesson._id.toString()) ?? {
              is_done: false,
              is_locked: true,
            };
            return {
              ...(lesson as ILesson & { toJSON: () => Record<string, unknown> }).toJSON(),
              is_done: status.is_done,
              is_locked: status.is_locked,
            };
          });

        return { ...chapter.toJSON(), lessons: chapterLessons };
      });

      return { ...module.toJSON(), chapters: chaptersWithLessons };
    });

    res.status(200).json({
      success: true,
      data: {
        course: {
          ...course.toJSON(),
          modules: modulesWithContent,
          isEnrolled: course.isFree ? true : isEnrolled,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Update Progress ──────────────────────────────────────────────────────────
// Butuh login. Menandai lesson sebagai selesai untuk user saat ini.
// Memakai upsert agar aman dipanggil berkali-kali (idempotent).

export const updateProgress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { lesson_id } = req.body;

    if (!lesson_id) {
      res.status(400).json({ success: false, message: 'lesson_id is required.' });
      return;
    }

    const lesson = await Lesson.findById(lesson_id);
    if (!lesson) {
      res.status(404).json({ success: false, message: 'Lesson not found.' });
      return;
    }

    // Quiz dan task punya endpoint sendiri — updateProgress hanya untuk video
    if (lesson.type === 'quiz') {
      res.status(400).json({ success: false, message: 'Gunakan endpoint /api/quiz/:lessonId/submit untuk menyelesaikan quiz.' });
      return;
    }
    if (lesson.type === 'task') {
      res.status(400).json({ success: false, message: 'Gunakan endpoint /api/tasks/:lessonId/submit untuk menyelesaikan task.' });
      return;
    }

    // Upsert: aman meski user klik "selesai" lebih dari sekali
    await Progress.findOneAndUpdate(
      { userId: req.userId, lessonId: lesson_id },
      {
        userId: req.userId,
        lessonId: lesson_id,
        courseId: lesson.courseId,
        completedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: 'Progress updated.' });
  } catch (err) {
    next(err);
  }
};

// ─── Progress Kurs ────────────────────────────────────────────────────────────
// Butuh login. Mengembalikan jumlah total lesson dan berapa yang sudah diselesaikan user.

export const getCourseProgress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Mongoose otomatis meng-cast string id ke ObjectId
    const [completedCount, totalCount] = await Promise.all([
      Progress.countDocuments({ userId: req.userId, courseId: id }),
      Lesson.countDocuments({ courseId: id }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        completed_lessons: completedCount,
        total_lessons: totalCount,
        percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      },
    });
  } catch (err) {
    next(err);
  }
};
