import { Router } from 'express';
import {
  getCourses,
  getTopics,
  getCourseDetail,
  updateProgress,
  getCourseProgress,
  getCourseCertificate,
} from '../controllers/courseController';
import { protect, optionalProtect } from '../middlewares/authMiddleware';

const router = Router();

// Path statis harus didaftarkan sebelum /:id agar tidak tertimpa sebagai parameter
router.get('/topics', getTopics);
router.post('/update-progress', protect, updateProgress);

router.get('/', getCourses);
router.get('/:id', optionalProtect, getCourseDetail);
router.get('/:id/progress', protect, getCourseProgress);
router.get('/:id/certificate', protect, getCourseCertificate);

export default router;
