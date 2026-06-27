import rateLimit from 'express-rate-limit';

// Limit login attempts — prevents brute force password attacks
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minute window
  max: 10,                    // max 10 attempts per IP per window
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limit OTP verification attempts — prevents brute force OTP guessing
export const verifyOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many verification attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limit resend OTP requests — prevents email spam abuse
export const resendOtpLimiter = rateLimit({
  windowMs: 60 * 1000,    // 1 minute window
  max: 1,                 // max 1 resend per minute per IP
  message: { success: false, message: 'Please wait 60 seconds before requesting a new OTP.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limit forgot password requests — prevents email spam abuse
export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many requests. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
