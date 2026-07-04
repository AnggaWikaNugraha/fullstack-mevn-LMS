import { Router } from 'express';
import authRoutes from './authRoutes';
import courseRoutes from './courseRoutes';
import bootcampRoutes from './bootcampRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/bootcamps', bootcampRoutes);

export default router;
