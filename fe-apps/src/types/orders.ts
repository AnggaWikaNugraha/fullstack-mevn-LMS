export interface MyOrder {
  _id: string;
  // Order lama dibuat sebelum field ini ada, jadi bisa saja tidak terkirim
  type?: 'course' | 'bootcamp';
  courseId?: {
    _id: string;
    title: string;
    cover_url: string;
  };
  batchId?: {
    _id: string;
    title: string;
    package_type: 'online' | 'offline' | 'hybrid';
    packageId: {
      _id: string;
      title: string;
      image_url: string;
    } | null;
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
