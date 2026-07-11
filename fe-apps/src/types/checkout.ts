export interface CreateOrderResponse {
  snap_token: string;
  order_id: string;
}

export interface EnrollmentStatus {
  isEnrolled: boolean;
  enrolledAt: string | null;
}

export interface VerifyPaymentResponse {
  payment_status: 'pending' | 'paid' | 'failed' | 'expired';
  isEnrolled: boolean;
}
