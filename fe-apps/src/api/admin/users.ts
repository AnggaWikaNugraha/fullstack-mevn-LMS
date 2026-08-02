import apiClient from '../client';
import type { ApiResponse, Pagination } from '@/types/api';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin' | 'mentor';
  avatar_url: string | null;
  isVerified: boolean;
  createdAt: string;
}

export interface AdminUserEnrollment {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    cover_url: string;
    level: string;
    topic_name: string;
  } | null;
  enrolledAt: string;
}

export interface AdminUserOrder {
  _id: string;
  courseId: { _id: string; title: string; cover_url: string } | null;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'expired';
  midtrans_order_id: string;
  paidAt: string | null;
  createdAt: string;
}

export interface AdminUserDetail extends AdminUser {
  enrollments: AdminUserEnrollment[];
  orders: AdminUserOrder[];
  total_spent: number;
}

export const adminListUsers = (params?: { page?: number; limit?: number; search?: string }) =>
  apiClient.get<ApiResponse<{ users: AdminUser[]; pagination: Pagination }>>('/admin/users', { params });

export const adminGetUser = (id: string) =>
  apiClient.get<ApiResponse<{ user: AdminUserDetail; enrollments: AdminUserEnrollment[]; orders: AdminUserOrder[]; total_spent: number }>>(`/admin/users/${id}`);

export const adminUpdateUserRole = (id: string, role: AdminUser['role']) =>
  apiClient.patch<ApiResponse<{ user: AdminUser }>>(`/admin/users/${id}/role`, { role });
