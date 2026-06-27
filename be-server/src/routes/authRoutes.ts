import { Router } from 'express';
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';
import {
  loginLimiter,
  verifyOtpLimiter,
  resendOtpLimiter,
  forgotPasswordLimiter,
} from '../middlewares/rateLimiter';

const router = Router();

// Public routes — no token required
router.post('/register', register);
router.post('/verify-otp', verifyOtpLimiter, verifyOtp);
router.post('/resend-otp', resendOtpLimiter, resendOtp);
router.post('/login', loginLimiter, login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/verify-reset-otp', verifyOtpLimiter, verifyResetOtp);
router.post('/reset-password', resetPassword);

// Protected routes — requires valid access token
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;
