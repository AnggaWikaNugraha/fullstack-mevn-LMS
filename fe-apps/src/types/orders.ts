export interface MyOrder {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    cover_url: string;
  };
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'expired';
  midtrans_order_id: string;
  paidAt: string | null;
  createdAt: string;
}

export interface MyOrdersResponse {
  orders: MyOrder[];
}
