import apiClient from '../client';
import type { ApiResponse } from '@/types/api';

export interface AdminCourse {
  _id: string;
  title: string;
  description: string;
  cover_url: string;
  topic: string;
  topic_name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isFree: boolean;
  price: number;
  status: 'draft' | 'published';
  total_lessons: number;
  total_students: number;
  createdAt: string;
}

export interface AdminLesson {
  _id: string;
  title: string;
  type: 'video' | 'quiz' | 'task';
  order: number;
  duration: number;
  video_url: string | null;
  description: string;
  is_locked: boolean;
  passing_score: number;
}

export interface AdminChapter {
  _id: string;
  title: string;
  order: number;
  lessons: AdminLesson[];
}

export interface AdminModule {
  _id: string;
  title: string;
  order: number;
  chapters: AdminChapter[];
}

export interface AdminCourseDetail extends Omit<AdminCourse, 'total_lessons' | 'total_students'> {
  modules: AdminModule[];
}

export interface CoursePayload {
  title: string;
  description: string;
  cover_url: string;
  topic: string;
  topic_name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isFree: boolean;
  price: number;
}

// Course CRUD
export const adminListCourses = () =>
  apiClient.get<ApiResponse<{ courses: AdminCourse[] }>>('/admin/courses');

export const adminGetCourse = (id: string) =>
  apiClient.get<ApiResponse<{ course: AdminCourseDetail }>>(`/admin/courses/${id}`);

export const adminCreateCourse = (payload: CoursePayload) =>
  apiClient.post<ApiResponse<{ course: AdminCourse }>>('/admin/courses', payload);

export const adminUpdateCourse = (id: string, payload: Partial<CoursePayload & { status: 'draft' | 'published' }>) =>
  apiClient.patch<ApiResponse<{ course: AdminCourse }>>(`/admin/courses/${id}`, payload);

export const adminDeleteCourse = (id: string) =>
  apiClient.delete<ApiResponse<null>>(`/admin/courses/${id}`);

// Module
export const adminCreateModule = (courseId: string, payload: { title: string; order: number }) =>
  apiClient.post(`/admin/courses/${courseId}/modules`, payload);

export const adminUpdateModule = (id: string, payload: { title?: string; order?: number }) =>
  apiClient.patch(`/admin/courses/modules/${id}`, payload);

export const adminDeleteModule = (id: string) =>
  apiClient.delete(`/admin/courses/modules/${id}`);

// Chapter
export const adminCreateChapter = (moduleId: string, payload: { title: string; order: number }) =>
  apiClient.post(`/admin/courses/modules/${moduleId}/chapters`, payload);

export const adminUpdateChapter = (id: string, payload: { title?: string; order?: number }) =>
  apiClient.patch(`/admin/courses/chapters/${id}`, payload);

export const adminDeleteChapter = (id: string) =>
  apiClient.delete(`/admin/courses/chapters/${id}`);

// Lesson
export const adminCreateLesson = (chapterId: string, payload: Partial<AdminLesson>) =>
  apiClient.post(`/admin/courses/chapters/${chapterId}/lessons`, payload);

export const adminUpdateLesson = (id: string, payload: Partial<AdminLesson>) =>
  apiClient.patch(`/admin/courses/lessons/${id}`, payload);

export const adminDeleteLesson = (id: string) =>
  apiClient.delete(`/admin/courses/lessons/${id}`);
