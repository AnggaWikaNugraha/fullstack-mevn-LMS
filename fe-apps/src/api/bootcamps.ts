import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type {
  BootcampListResponse,
  BootcampDetailResponse,
  BootcampEnrollmentStatus,
} from '@/types/bootcamps';
import type { CreateOrderResponse } from '@/types/checkout';

export interface GetBootcampsParams {
  page?: number;
  limit?: number;
  status?: 'open' | 'coming_soon' | 'closed';
  search?: string;
}

export const getBootcamps = (params?: GetBootcampsParams) =>
  apiClient.get<ApiResponse<BootcampListResponse>>('/bootcamps', { params });

export const getBootcampDetail = (id: string) =>
  apiClient.get<ApiResponse<BootcampDetailResponse>>(`/bootcamps/${id}`);

export const createBootcampOrder = (batchId: string) =>
  apiClient.post<ApiResponse<CreateOrderResponse>>('/checkout/bootcamp/create-order', { batchId });

export const checkBootcampEnrollment = (batchId: string) =>
  apiClient.get<ApiResponse<BootcampEnrollmentStatus>>(`/bootcamps/enrollments/check/${batchId}`);
