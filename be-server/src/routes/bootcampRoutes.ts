import { Router } from 'express';
import { getBootcamps, getBootcampDetail, checkBootcampEnrollment } from '../controllers/bootcampController';
import { protect, optionalProtect } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getBootcamps);
// Harus di atas '/:id', kalau tidak segmen 'enrollments' ikut tertangkap sebagai id
router.get('/enrollments/check/:batchId', protect, checkBootcampEnrollment);
// optionalProtect agar detail bisa menyertakan isEnrolled untuk user yang login
router.get('/:id', optionalProtect, getBootcampDetail);

export default router;
