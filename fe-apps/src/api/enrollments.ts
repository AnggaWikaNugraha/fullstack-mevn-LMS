import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type { EnrollmentStatus } from '@/types/checkout';
import type { MyCoursesResponse } from '@/types/enrollments';

export const checkEnrollment = (courseId: string) =>
  apiClient.get<ApiResponse<EnrollmentStatus>>(`/enrollments/check/${courseId}`);

export const getMyCourses = () =>
  apiClient.get<ApiResponse<MyCoursesResponse>>('/enrollments/my-courses');

