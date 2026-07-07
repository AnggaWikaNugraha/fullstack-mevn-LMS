import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type { TaskSubmitPayload, TaskSubmission } from '@/types/quiz';

export const submitTask = (lessonId: string, payload: TaskSubmitPayload) =>
  apiClient.post<ApiResponse<{ submission: TaskSubmission }>>(`/tasks/${lessonId}/submit`, payload);

export const getMySubmission = (lessonId: string) =>
  apiClient.get<ApiResponse<{ submission: TaskSubmission | null }>>(`/tasks/${lessonId}/my-submission`);
