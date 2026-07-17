import { Response, NextFunction } from 'express';
import Course from '../../models/Course';
import Module from '../../models/Module';
import Chapter from '../../models/Chapter';
import Lesson from '../../models/Lesson';
import QuizQuestion from '../../models/QuizQuestion';
import QuizAttempt from '../../models/QuizAttempt';
import Progress from '../../models/Progress';
import TaskSubmission from '../../models/TaskSubmission';
import Enrollment from '../../models/Enrollment';
import { AuthRequest } from '../../middlewares/authMiddleware';

// ─── Helper: hapus semua data di bawah lesson ────────────────────────────────

async function cascadeDeleteLessons(lessonIds: unknown[]) {
  await Promise.all([
    QuizQuestion.deleteMany({ lessonId: { $in: lessonIds } }),
    QuizAttempt.deleteMany({ lessonId: { $in: lessonIds } }),
    Progress.deleteMany({ lessonId: { $in: lessonIds } }),
    TaskSubmission.deleteMany({ lessonId: { $in: lessonIds } }),
  ]);
}

// ─── List semua course (draft + published) ───────────────────────────────────

export const listCourses = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    const result = await Promise.all(
      courses.map(async (c) => {
        const modules = await Module.find({ courseId: c._id }).select('_id');
        const moduleIds = modules.map((m) => m._id);
        const chapters = await Chapter.find({ moduleId: { $in: moduleIds } }).select('_id');
        const chapterIds = chapters.map((ch) => ch._id);
        const [total_lessons, total_students] = await Promise.all([
          Lesson.countDocuments({ chapterId: { $in: chapterIds } }),
          Enrollment.countDocuments({ courseId: c._id }),
        ]);
        return { ...c.toObject(), total_lessons, total_students };
      })
    );

    res.status(200).json({ success: true, data: { courses: result } });
  } catch (err) {
    next(err);
  }
};

// ─── Detail course (untuk pre-fill form edit + CourseContentView) ─────────────

export const getCourseDetail = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }

    const modules = await Module.find({ courseId: id }).sort({ order: 1 });
    const moduleIds = modules.map((m) => m._id);
    const chapters = await Chapter.find({ moduleId: { $in: moduleIds } }).sort({ order: 1 });
    const chapterIds = chapters.map((c) => c._id);
    const lessons = await Lesson.find({ chapterId: { $in: chapterIds } }).sort({ order: 1 });

    const modulesWithContent = modules.map((mod) => ({
      ...mod.toObject(),
      chapters: chapters
        .filter((ch) => ch.moduleId.toString() === mod._id.toString())
        .map((ch) => ({
          ...ch.toObject(),
          lessons: lessons.filter((l) => l.chapterId.toString() === ch._id.toString()),
        })),
    }));

    res.status(200).json({ success: true, data: { course: { ...course.toObject(), modules: modulesWithContent } } });
  } catch (err) {
    next(err);
  }
};

// ─── Buat course baru ────────────────────────────────────────────────────────

export const createCourse = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, cover_url, topic, topic_name, level, isFree, price } = req.body;
    const course = await Course.create({
      title,
      description,
      cover_url,
      topic,
      topic_name,
      level,
      isFree: isFree ?? false,
      price: isFree ? 0 : (price ?? 0),
      status: 'draft',
    });
    res.status(201).json({ success: true, data: { course } });
  } catch (err) {
    next(err);
  }
};

// ─── Update course (info + publish/unpublish) ────────────────────────────────

export const updateCourse = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, cover_url, topic, topic_name, level, isFree, price, status } = req.body;

    const course = await Course.findByIdAndUpdate(
      id,
      {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(cover_url !== undefined && { cover_url }),
        ...(topic !== undefined && { topic }),
        ...(topic_name !== undefined && { topic_name }),
        ...(level !== undefined && { level }),
        ...(isFree !== undefined && { isFree }),
        ...(price !== undefined && { price: isFree ? 0 : price }),
        ...(status !== undefined && { status }),
      },
      { new: true, runValidators: true }
    );

    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }

    res.status(200).json({ success: true, data: { course } });
  } catch (err) {
    next(err);
  }
};

// ─── Hapus course + cascade ──────────────────────────────────────────────────

export const deleteCourse = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }

    const modules = await Module.find({ courseId: id }).select('_id');
    const moduleIds = modules.map((m) => m._id);
    const chapters = await Chapter.find({ moduleId: { $in: moduleIds } }).select('_id');
    const chapterIds = chapters.map((c) => c._id);
    const lessons = await Lesson.find({ chapterId: { $in: chapterIds } }).select('_id');
    const lessonIds = lessons.map((l) => l._id);

    await cascadeDeleteLessons(lessonIds);
    await Promise.all([
      Lesson.deleteMany({ chapterId: { $in: chapterIds } }),
      Chapter.deleteMany({ moduleId: { $in: moduleIds } }),
      Module.deleteMany({ courseId: id }),
      Enrollment.deleteMany({ courseId: id }),
      Progress.deleteMany({ courseId: id }),
      Course.findByIdAndDelete(id),
    ]);

    res.status(200).json({ success: true, message: 'Course deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── Module ──────────────────────────────────────────────────────────────────

export const createModule = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: courseId } = req.params;
    const { title, order } = req.body;
    const mod = await Module.create({ courseId, title, order });
    res.status(201).json({ success: true, data: { module: mod } });
  } catch (err) {
    next(err);
  }
};

export const updateModule = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const mod = await Module.findByIdAndUpdate(id, req.body, { new: true });
    if (!mod) { res.status(404).json({ success: false, message: 'Module not found.' }); return; }
    res.status(200).json({ success: true, data: { module: mod } });
  } catch (err) {
    next(err);
  }
};

export const deleteModule = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const chapters = await Chapter.find({ moduleId: id }).select('_id');
    const chapterIds = chapters.map((c) => c._id);
    const lessons = await Lesson.find({ chapterId: { $in: chapterIds } }).select('_id');
    const lessonIds = lessons.map((l) => l._id);

    await cascadeDeleteLessons(lessonIds);
    await Promise.all([
      Lesson.deleteMany({ chapterId: { $in: chapterIds } }),
      Chapter.deleteMany({ moduleId: id }),
      Module.findByIdAndDelete(id),
    ]);

    res.status(200).json({ success: true, message: 'Module deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── Chapter ─────────────────────────────────────────────────────────────────

export const createChapter = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: moduleId } = req.params;
    const { title, order } = req.body;
    const chapter = await Chapter.create({ moduleId, title, order });
    res.status(201).json({ success: true, data: { chapter } });
  } catch (err) {
    next(err);
  }
};

export const updateChapter = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const chapter = await Chapter.findByIdAndUpdate(id, req.body, { new: true });
    if (!chapter) { res.status(404).json({ success: false, message: 'Chapter not found.' }); return; }
    res.status(200).json({ success: true, data: { chapter } });
  } catch (err) {
    next(err);
  }
};

export const deleteChapter = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const lessons = await Lesson.find({ chapterId: id }).select('_id');
    const lessonIds = lessons.map((l) => l._id);

    await cascadeDeleteLessons(lessonIds);
    await Promise.all([
      Lesson.deleteMany({ chapterId: id }),
      Chapter.findByIdAndDelete(id),
    ]);

    res.status(200).json({ success: true, message: 'Chapter deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── Lesson ──────────────────────────────────────────────────────────────────

export const createLesson = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: chapterId } = req.params;
    const chapter = await Chapter.findById(chapterId).select('moduleId');
    if (!chapter) { res.status(404).json({ success: false, message: 'Chapter not found.' }); return; }
    const mod = await Module.findById(chapter.moduleId).select('courseId');
    if (!mod) { res.status(404).json({ success: false, message: 'Module not found.' }); return; }

    const { title, type, order, duration, video_url, description, is_locked, passing_score } = req.body;
    const lesson = await Lesson.create({
      chapterId,
      courseId: mod.courseId,
      title,
      type,
      order,
      duration: duration ?? 0,
      video_url: video_url ?? null,
      description: description ?? '',
      is_locked: is_locked ?? true,
      passing_score: passing_score ?? 70,
    });
    res.status(201).json({ success: true, data: { lesson } });
  } catch (err) {
    next(err);
  }
};

export const updateLesson = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findByIdAndUpdate(id, req.body, { new: true });
    if (!lesson) { res.status(404).json({ success: false, message: 'Lesson not found.' }); return; }
    res.status(200).json({ success: true, data: { lesson } });
  } catch (err) {
    next(err);
  }
};

export const deleteLesson = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await cascadeDeleteLessons([id]);
    await Lesson.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Lesson deleted.' });
  } catch (err) {
    next(err);
  }
};
