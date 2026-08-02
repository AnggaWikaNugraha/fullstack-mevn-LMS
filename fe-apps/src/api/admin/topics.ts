import apiClient from '../client';
import type { ApiResponse } from '@/types/api';

export interface AdminTopic {
  _id: string;
  slug: string;
  name: string;
  createdAt: string;
}

export interface TopicPayload {
  slug: string;
  name: string;
}

export const adminListTopics = () =>
  apiClient.get<ApiResponse<{ topics: AdminTopic[] }>>('/admin/topics');

export const adminCreateTopic = (payload: TopicPayload) =>
  apiClient.post<ApiResponse<{ topic: AdminTopic }>>('/admin/topics', payload);

export const adminUpdateTopic = (id: string, payload: Partial<TopicPayload>) =>
  apiClient.patch<ApiResponse<{ topic: AdminTopic }>>(`/admin/topics/${id}`, payload);

export const adminDeleteTopic = (id: string) =>
  apiClient.delete<ApiResponse<null>>(`/admin/topics/${id}`);
