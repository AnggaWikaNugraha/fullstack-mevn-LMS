import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware';
import { adminOnly } from '../../middlewares/adminMiddleware';
import {
  listCourses,
  getCourseDetail,
  createCourse,
  updateCourse,
  deleteCourse,
  createModule,
  updateModule,
  deleteModule,
  createChapter,
  updateChapter,
  deleteChapter,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../../controllers/admin/courseAdminController';

const router = Router();

router.use(protect, adminOnly);

// Course CRUD
router.get('/', listCourses);
router.get('/:id', getCourseDetail);
router.post('/', createCourse);
router.patch('/:id', updateCourse);
router.delete('/:id', deleteCourse);

// Module
router.post('/:id/modules', createModule);
router.patch('/modules/:id', updateModule);
router.delete('/modules/:id', deleteModule);

// Chapter
router.post('/modules/:id/chapters', createChapter);
router.patch('/chapters/:id', updateChapter);
router.delete('/chapters/:id', deleteChapter);

// Lesson
router.post('/chapters/:id/lessons', createLesson);
router.patch('/lessons/:id', updateLesson);
router.delete('/lessons/:id', deleteLesson);

export default router;
