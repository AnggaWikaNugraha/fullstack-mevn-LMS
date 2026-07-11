import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type { User, UpdateProfilePayload, ChangePasswordPayload } from '@/types/auth';

export const getProfile = () =>
  apiClient.get<ApiResponse<{ user: User }>>('/users/profile');

export const updateProfile = (payload: UpdateProfilePayload) =>
  apiClient.patch<ApiResponse<{ user: User }>>('/users/profile', payload);

export const changePassword = (payload: ChangePasswordPayload) =>
  apiClient.patch<ApiResponse<null>>('/users/change-password', payload);
