import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type { CreateOrderResponse, VerifyPaymentResponse } from '@/types/checkout';

export const createOrder = (courseId: string) =>
  apiClient.post<ApiResponse<CreateOrderResponse>>('/checkout/create-order', { courseId });

// Cek status pembayaran langsung ke Midtrans — tidak butuh webhook
export const verifyPayment = (orderId: string) =>
  apiClient.get<ApiResponse<VerifyPaymentResponse>>(`/checkout/verify/${orderId}`);
