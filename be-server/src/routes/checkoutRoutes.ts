import { Router } from 'express';
import { createOrder, verifyPayment, handleWebhook } from '../controllers/checkoutController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.post('/create-order', protect, createOrder);
// Verifikasi status pembayaran langsung ke Midtrans — tidak butuh webhook
router.get('/verify/:orderId', protect, verifyPayment);
// Webhook tidak pakai protect — dipanggil langsung oleh server Midtrans
router.post('/webhook', handleWebhook);

export default router;
