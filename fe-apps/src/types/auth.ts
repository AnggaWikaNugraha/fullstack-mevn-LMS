import type { ApiResponse } from './api';

// ─── Request types (what FE sends to BE) ────────────────────────────────────

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  deviceId: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyResetOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface GoogleLoginPayload {
  code: string;
  deviceId: string;
}

// ─── Response types (what BE returns) ───────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  isVerified: boolean;
  avatar_url: string | null;
  createdAt: string;
}

export interface UpdateProfilePayload {
  name: string;
  avatar_url?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends ApiResponse<{
  accessToken: string;
  refreshToken: string;
  user: User;
}> {}

