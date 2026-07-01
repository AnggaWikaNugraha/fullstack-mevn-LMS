import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import Session from '../models/Session';
import { sendMail } from '../config/mailer';
import { otpEmailTemplate } from '../templates/otpEmail';
import {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleAuthSchema,
} from '../validations/authValidation';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// ─── Helpers ────────────────────────────────────────────────────────────────

// Generate a random 6-digit OTP string
const generateOtp = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

// OTP is valid for 15 minutes from now
const otpExpiryDate = (): Date => {
  return new Date(Date.now() + 15 * 60 * 1000);
};

// Sign a short-lived access token (15 minutes)
const signAccessToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: '15m',
  });
};

// Sign a long-lived refresh token (1 day fixed)
const signRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: '1d',
  });
};

// ─── Register ────────────────────────────────────────────────────────────────

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Step 1 — Validate request body against Zod schema
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { name, email, password } = parsed.data;

    // Step 2 — Check if email is already in use
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        // Verified account exists — do not allow re-registration
        res.status(409).json({ success: false, message: 'Email is already registered.' });
        return;
      }
      // Unverified account exists — delete it so user can register fresh
      await User.deleteOne({ _id: existingUser._id });
    }

    // Step 3 — Create new user (password will be hashed by the pre-save hook in User model)
    const otp = generateOtp();
    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpires: otpExpiryDate(),
      otpLastSentAt: new Date(),
    });

    // Step 4 — Send OTP to user's email
    await sendMail(
      email,
      'Verify Your Account',
      otpEmailTemplate(name, otp, 'verification')
    );

    // Return success — do not expose OTP or user data here
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for the OTP.',
      data: { email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Verify OTP ──────────────────────────────────────────────────────────────

export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Step 1 — Validate request body
    const parsed = verifyOtpSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, otp } = parsed.data;

    // Step 2 — Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    // Step 3 — Check if OTP has expired
    if (!user.otpExpires || user.otpExpires < new Date()) {
      res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
      return;
    }

    // Step 4 — Check if OTP matches
    if (user.otp !== otp) {
      res.status(400).json({ success: false, message: 'Invalid OTP.' });
      return;
    }

    // Step 5 — Mark account as verified and clear OTP fields
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    user.otpLastSentAt = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account verified successfully. You can now log in.',
    });
  } catch (err) {
    next(err);
  }
};

// ─── Resend OTP ───────────────────────────────────────────────────────────────

export const resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Step 1 — Validate request body
    const parsed = resendOtpSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email } = parsed.data;

    // Step 2 — Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ success: false, message: 'Account is already verified.' });
      return;
    }

    // Step 3 — Enforce 60-second cooldown between resend requests
    // This check is a safety net on top of the rate limiter middleware
    if (user.otpLastSentAt) {
      const secondsSinceLastSent = (Date.now() - user.otpLastSentAt.getTime()) / 1000;
      if (secondsSinceLastSent < 60) {
        const waitSeconds = Math.ceil(60 - secondsSinceLastSent);
        res.status(429).json({
          success: false,
          message: `Please wait ${waitSeconds} seconds before requesting a new OTP.`,
        });
        return;
      }
    }

    // Step 4 — Generate new OTP and send email
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = otpExpiryDate();
    user.otpLastSentAt = new Date();
    await user.save();

    await sendMail(
      email,
      'Your New OTP Code',
      otpEmailTemplate(user.name, otp, 'verification')
    );

    res.status(200).json({
      success: true,
      message: 'A new OTP has been sent to your email.',
    });
  } catch (err) {
    next(err);
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Step 1 — Validate request body
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password, deviceId } = parsed.data;

    // Step 2 — Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    // Step 2a — Google-only account: no password set, guide user to set one via Forgot Password
    if (!user.password) {
      res.status(403).json({
        success: false,
        code: 'GOOGLE_ONLY_ACCOUNT',
        message: 'This account was created with Google. Please set a password first via Forgot Password.',
      });
      return;
    }

    // Step 2b — Verify password
    if (!(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    // Step 3 — Block login if account is not verified yet
    if (!user.isVerified) {
      res.status(403).json({
        success: false,
        message: 'Account is not verified. Please check your email for the OTP.',
      });
      return;
    }

    // Step 4 — Check for an existing active session
    const existingSession = await Session.findOne({ userId: user._id });

    if (existingSession) {
      const isExpired = existingSession.refreshExpiredAt < new Date();

      if (!isExpired && existingSession.deviceId !== deviceId) {
        // Active session exists on a different device — reject login
        res.status(403).json({
          success: false,
          message: 'Your account is active on another device. Please log out first.',
        });
        return;
      }

      // Session expired or same device — remove old session before creating new one
      await Session.deleteOne({ _id: existingSession._id });
    }

    // Step 5 — Generate tokens
    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    // Step 6 — Hash the refresh token before storing in DB
    // This way, if the DB is breached, raw refresh tokens are not exposed
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // Step 7 — Save new session to DB
    const refreshExpiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    await Session.create({
      userId: user._id,
      deviceId,
      refreshToken: hashedRefreshToken,
      refreshExpiredAt,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        accessToken,
        refreshToken,  // raw token — FE stores this in localStorage
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken: token, deviceId } = req.body;

    if (!token || !deviceId) {
      res.status(400).json({ success: false, message: 'Refresh token and device ID are required.' });
      return;
    }

    // Step 1 — Verify the refresh token signature
    let decoded: { id: string };
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as { id: string };
    } catch {
      res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });
      return;
    }

    // Step 2 — Find the session for this user + device
    const session = await Session.findOne({ userId: decoded.id, deviceId });
    if (!session) {
      res.status(401).json({ success: false, message: 'Session not found. Please log in again.' });
      return;
    }

    // Step 3 — Compare raw refresh token against the hashed one stored in DB
    const isValid = await bcrypt.compare(token, session.refreshToken);
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Invalid refresh token.' });
      return;
    }

    // Step 4 — Issue a new access token
    const newAccessToken = signAccessToken(decoded.id);

    res.status(200).json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { deviceId } = req.body;
    const userId = (req as any).userId; // set by auth middleware

    // Delete the session for this specific device
    await Session.deleteOne({ userId, deviceId });

    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
};

// ─── Get Current User ─────────────────────────────────────────────────────────

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).userId; // set by auth middleware

    // Fetch fresh user data from DB — sensitive fields are stripped by toJSON
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Step 1 — Validate request body
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email } = parsed.data;

    // Step 2 — Find user (always return success to avoid email enumeration attacks)
    const user = await User.findOne({ email, isVerified: true });
    if (!user) {
      // Return 200 even if email not found — security best practice
      res.status(200).json({
        success: true,
        message: 'If that email exists, an OTP has been sent.',
      });
      return;
    }

    // Step 3 — Generate OTP and send email
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = otpExpiryDate();
    user.otpLastSentAt = new Date();
    await user.save();

    await sendMail(
      email,
      'Reset Your Password',
      otpEmailTemplate(user.name, otp, 'reset')
    );

    res.status(200).json({
      success: true,
      message: 'If that email exists, an OTP has been sent.',
    });
  } catch (err) {
    next(err);
  }
};

// ─── Verify Reset OTP ─────────────────────────────────────────────────────────

export const verifyResetOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = verifyOtpSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, otp } = parsed.data;

    const user = await User.findOne({ email, isVerified: true });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
      return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ success: false, message: 'Invalid OTP.' });
      return;
    }

    // OTP is valid — FE can now proceed to the reset password page
    res.status(200).json({
      success: true,
      message: 'OTP verified. You may now reset your password.',
    });
  } catch (err) {
    next(err);
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, otp, newPassword } = parsed.data;

    const user = await User.findOne({ email, isVerified: true });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    // Re-validate OTP — prevents someone skipping the verify-reset-otp step
    if (!user.otpExpires || user.otpExpires < new Date() || user.otp !== otp) {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
      return;
    }

    // Update password — pre-save hook will hash it automatically
    user.password = newPassword;
    user.otp = null;
    user.otpExpires = null;
    user.otpLastSentAt = null;
    await user.save();

    // Delete all active sessions — user must log in again on all devices
    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. Please log in with your new password.',
    });
  } catch (err) {
    next(err);
  }
};

// ─── Google Login ─────────────────────────────────────────────────────────────

export const googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Step 1 — Validate request body
    const parsed = googleAuthSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { code, deviceId } = parsed.data;

    // Step 2 — Exchange authorization code for tokens, then verify the id_token
    let googlePayload: { sub: string; email: string; name: string };
    try {
      // Exchange code → get access_token + id_token from Google
      const { tokens } = await googleClient.getToken({
        code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      });

      if (!tokens.id_token) throw new Error('No id_token in response');

      // Verify the id_token signature and extract user info
      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.sub) {
        throw new Error('Invalid token payload');
      }

      googlePayload = {
        sub: payload.sub,
        email: payload.email,
        name: payload.name ?? payload.email,
      };
    } catch (googleErr) {
      console.error('[Google OAuth Error]', googleErr);
      res.status(401).json({ success: false, message: 'Google authentication failed. Please try again.' });
      return;
    }

    const { sub: googleId, email, name } = googlePayload;

    // Step 3 — Find or create/merge user
    let user = await User.findOne({ email });

    if (!user) {
      // New email — create a Google-only account (no password, already verified)
      user = await User.create({
        name,
        email,
        googleId,
        isVerified: true,
      });
    } else if (!user.googleId) {
      // Existing email/password account — merge by adding googleId
      user.googleId = googleId;
      await user.save();
    }
    // If googleId already exists, just proceed to session logic below

    // Step 4 — Check for an existing active session (same logic as regular login)
    const existingSession = await Session.findOne({ userId: user._id });

    if (existingSession) {
      const isExpired = existingSession.refreshExpiredAt < new Date();

      if (!isExpired && existingSession.deviceId !== deviceId) {
        res.status(403).json({
          success: false,
          message: 'Your account is active on another device. Please log out first.',
        });
        return;
      }

      await Session.deleteOne({ _id: existingSession._id });
    }

    // Step 5 — Generate tokens and create session
    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const refreshExpiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await Session.create({
      userId: user._id,
      deviceId,
      refreshToken: hashedRefreshToken,
      refreshExpiredAt,
    });

    res.status(200).json({
      success: true,
      message: 'Google login successful.',
      data: {
        accessToken,
        refreshToken,
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
