import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type { BootcampListResponse, BootcampDetailResponse } from '@/types/bootcamps';

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
