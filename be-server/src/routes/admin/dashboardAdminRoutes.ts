import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware';
import { adminOnly } from '../../middlewares/adminMiddleware';
import { getDashboardStats, getRevenueReport } from '../../controllers/admin/dashboardAdminController';

const router = Router();

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/revenue', getRevenueReport);

export default router;
