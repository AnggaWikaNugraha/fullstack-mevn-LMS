import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);
router.patch('/change-password', protect, changePassword);

export default router;
