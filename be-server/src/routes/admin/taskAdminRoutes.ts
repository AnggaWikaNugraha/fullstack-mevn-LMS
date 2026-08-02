import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware';
import { adminOnly } from '../../middlewares/adminMiddleware';
import { listSubmissions, reviewSubmission } from '../../controllers/admin/taskAdminController';

const router = Router();

router.use(protect, adminOnly);

router.get('/', listSubmissions);
router.patch('/:id', reviewSubmission);

export default router;
