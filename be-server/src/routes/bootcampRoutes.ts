import { Router } from 'express';
import {
  getBootcamps,
  getBootcampDetail,
  checkBootcampEnrollment,
  getMyBootcampEnrollments,
} from '../controllers/bootcampController';
import { getSessionToken } from '../controllers/liveSessionController';
import { protect, optionalProtect } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getBootcamps);
// Harus di atas '/:id', kalau tidak segmen 'enrollments'/'my-enrollments' ikut tertangkap sebagai id
router.get('/my-enrollments', protect, getMyBootcampEnrollments);
router.get('/enrollments/check/:batchId', protect, checkBootcampEnrollment);
router.post('/sessions/:sessionId/token', protect, getSessionToken);
// optionalProtect agar detail bisa menyertakan isEnrolled untuk user yang login
router.get('/:id', optionalProtect, getBootcampDetail);

export default router;
