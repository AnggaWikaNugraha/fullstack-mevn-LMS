import { Router } from 'express';
import {
  getCourses,
  getTopics,
  getCourseDetail,
  updateProgress,
  getCourseProgress,
} from '../controllers/courseController';
import { protect, optionalProtect } from '../middlewares/authMiddleware';

const router = Router();

// Path statis harus didaftarkan sebelum /:id agar tidak tertimpa sebagai parameter
router.get('/topics', getTopics);
router.post('/update-progress', protect, updateProgress);

router.get('/', getCourses);
router.get('/:id', optionalProtect, getCourseDetail);
router.get('/:id/progress', protect, getCourseProgress);

export default router;
