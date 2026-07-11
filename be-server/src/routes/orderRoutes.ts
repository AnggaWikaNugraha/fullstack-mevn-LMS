import { Router } from 'express';
import { getMyOrders } from '../controllers/orderController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.get('/my-orders', protect, getMyOrders);

export default router;
