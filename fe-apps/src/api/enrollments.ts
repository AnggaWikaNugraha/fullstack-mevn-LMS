import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type { EnrollmentStatus } from '@/types/checkout';

export const checkEnrollment = (courseId: string) =>
  apiClient.get<ApiResponse<EnrollmentStatus>>(`/enrollments/check/${courseId}`);

