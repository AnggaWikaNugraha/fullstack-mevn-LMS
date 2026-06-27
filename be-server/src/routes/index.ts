import { Router } from 'express';
import authRoutes from './authRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// Mount auth routes under /auth prefix
// All endpoints become: /api/auth/register, /api/auth/login, etc.
router.use('/auth', authRoutes);

export default router;
