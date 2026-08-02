import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware';
import { adminOnly } from '../../middlewares/adminMiddleware';
import { listUsers, getUserDetail, updateUserRole } from '../../controllers/admin/userAdminController';

const router = Router();

router.use(protect, adminOnly);

router.get('/', listUsers);
router.get('/:id', getUserDetail);
router.patch('/:id/role', updateUserRole);

export default router;
