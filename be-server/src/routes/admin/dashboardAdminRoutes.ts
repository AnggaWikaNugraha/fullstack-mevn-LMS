import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware';
import { adminOnly } from '../../middlewares/adminMiddleware';
import { getDashboardStats, getRevenueReport } from '../../controllers/admin/dashboardAdminController';
import { getLiveUsage } from '../../controllers/liveSessionController';

const router = Router();

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/revenue', getRevenueReport);
// Sisa kuota menit gratis Agora bulan berjalan
router.get('/live-usage', getLiveUsage);

export default router;
