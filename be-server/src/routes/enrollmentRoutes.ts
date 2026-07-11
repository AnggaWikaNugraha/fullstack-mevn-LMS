import { Router } from 'express';
import { checkEnrollment, getMyCourses } from '../controllers/enrollmentController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.get('/my-courses', protect, getMyCourses);
router.get('/check/:courseId', protect, checkEnrollment);

export default router;
