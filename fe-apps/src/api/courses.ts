import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type {
  CourseListResponse,
  Topic,
  CourseDetailResponse,
  CourseProgressResponse,
} from '@/types/courses';

export const getCourses = (params?: { topic?: string; page?: number; limit?: number }) =>
  apiClient.get<ApiResponse<CourseListResponse>>('/courses', { params });

export const getTopics = () =>
  apiClient.get<ApiResponse<{ topics: Topic[] }>>('/courses/topics');

export const getCourseDetail = (courseId: string) =>
  apiClient.get<ApiResponse<CourseDetailResponse>>(`/courses/${courseId}`);

export const updateProgress = (payload: { lesson_id: string }) =>
  apiClient.post<ApiResponse<null>>('/courses/update-progress', payload);

export const getCourseProgress = (courseId: string) =>
  apiClient.get<ApiResponse<CourseProgressResponse>>(`/courses/${courseId}/progress`);
