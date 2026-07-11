import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type { MyOrdersResponse } from '@/types/orders';

export const getMyOrders = () =>
  apiClient.get<ApiResponse<MyOrdersResponse>>('/orders/my-orders');
