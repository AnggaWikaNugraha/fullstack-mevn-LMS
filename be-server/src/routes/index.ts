import { Router } from 'express';
import authRoutes from './authRoutes';
import courseRoutes from './courseRoutes';
import bootcampRoutes from './bootcampRoutes';
import quizRoutes from './quizRoutes';
import taskRoutes from './taskRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/bootcamps', bootcampRoutes);
router.use('/quiz', quizRoutes);
router.use('/tasks', taskRoutes);

export default router;
