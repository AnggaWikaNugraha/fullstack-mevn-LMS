import apiClient from '../client';
import type { ApiResponse, Pagination } from '@/types/api';

export interface AdminTaskSubmission {
  _id: string;
  userId: { _id: string; name: string; email: string; avatar_url: string | null };
  lessonId: { _id: string; title: string; type: string } | null;
  courseId: { _id: string; title: string } | null;
  submission_url: string;
  note: string;
  status: 'submitted' | 'approved' | 'rejected';
  feedback: string | null;
  submittedAt: string;
}

export const adminListSubmissions = (params?: { status?: string; page?: number; limit?: number }) =>
  apiClient.get<ApiResponse<{ submissions: AdminTaskSubmission[]; pagination: Pagination }>>('/admin/tasks', { params });

export const adminReviewSubmission = (id: string, payload: { status: 'approved' | 'rejected'; feedback?: string }) =>
  apiClient.patch<ApiResponse<{ submission: AdminTaskSubmission }>>(`/admin/tasks/${id}`, payload);
