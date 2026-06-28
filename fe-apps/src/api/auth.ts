import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type {
  RegisterPayload,
  VerifyOtpPayload,
  ResendOtpPayload,
  LoginPayload,
  ForgotPasswordPayload,
  VerifyResetOtpPayload,
  ResetPasswordPayload,
  LoginResponse,
  User,
} from '@/types/auth';

// All auth API calls are centralized here.
// Each function maps directly to one BE endpoint.

export const register = (payload: RegisterPayload) =>
  apiClient.post<ApiResponse>('/auth/register', payload);

export const verifyOtp = (payload: VerifyOtpPayload) =>
  apiClient.post<ApiResponse>('/auth/verify-otp', payload);

export const resendOtp = (payload: ResendOtpPayload) =>
  apiClient.post<ApiResponse>('/auth/resend-otp', payload);

export const login = (payload: LoginPayload) =>
  apiClient.post<LoginResponse>('/auth/login', payload);

export const refreshAccessToken = (refreshToken: string, deviceId: string) =>
  apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken, deviceId });

export const logout = (deviceId: string) =>
  apiClient.post<ApiResponse>('/auth/logout', { deviceId });

export const getMe = () =>
  apiClient.get<ApiResponse<{ user: User }>>('/auth/me');

export const forgotPassword = (payload: ForgotPasswordPayload) =>
  apiClient.post<ApiResponse>('/auth/forgot-password', payload);

export const verifyResetOtp = (payload: VerifyResetOtpPayload) =>
  apiClient.post<ApiResponse>('/auth/verify-reset-otp', payload);

export const resetPassword = (payload: ResetPasswordPayload) =>
  apiClient.post<ApiResponse>('/auth/reset-password', payload);
