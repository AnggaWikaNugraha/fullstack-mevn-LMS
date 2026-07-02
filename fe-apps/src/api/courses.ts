import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type { CourseListResponse, Topic } from '@/types/courses';

export const getCourses = (params?: { topic?: string; page?: number; limit?: number }) =>
  apiClient.get<ApiResponse<CourseListResponse>>('/courses', { params });

export const getTopics = () =>
  apiClient.get<ApiResponse<{ topics: Topic[] }>>('/courses/topics');
