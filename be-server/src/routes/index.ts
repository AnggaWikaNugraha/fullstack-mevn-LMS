import { Router } from 'express';
import authRoutes from './authRoutes';
import courseRoutes from './courseRoutes';
import bootcampRoutes from './bootcampRoutes';
import quizRoutes from './quizRoutes';
import taskRoutes from './taskRoutes';
import checkoutRoutes from './checkoutRoutes';
import enrollmentRoutes from './enrollmentRoutes';
import userRoutes from './userRoutes';
import orderRoutes from './orderRoutes';
import courseAdminRoutes from './admin/courseAdminRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/bootcamps', bootcampRoutes);
router.use('/quiz', quizRoutes);
router.use('/tasks', taskRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/admin/courses', courseAdminRoutes);

export default router;
