import { Router } from 'express';
import { checkEnrollment } from '../controllers/enrollmentController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.get('/check/:courseId', protect, checkEnrollment);

export default router;
