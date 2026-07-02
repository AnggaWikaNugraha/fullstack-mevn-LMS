import { Router } from 'express';
import authRoutes from './authRoutes';
import courseRoutes from './courseRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);

export default router;
