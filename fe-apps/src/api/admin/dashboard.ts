import apiClient from '../client';
import type { ApiResponse } from '@/types/api';

// Bila produk atau user-nya sudah dihapus, backend mengirim label pengganti
// dengan _id bernilai null, bukan menghilangkan ordernya.
// `item` menampung course maupun batch bootcamp, dibedakan lewat `type`.
export interface AdminRecentOrder {
  _id: string;
  amount: number;
  paidAt: string | null;
  type: 'course' | 'bootcamp';
  user: { _id: string | null; name: string; email: string; avatar_url: string | null };
  item: { _id: string | null; title: string; cover_url: string | null };
}

export interface AdminDashboardStats {
  users: { total: number; newThisMonth: number };
  courses: { published: number; draft: number };
  enrollments: { total: number };
  revenue: { allTime: number; thisMonth: number };
  recentOrders: AdminRecentOrder[];
}

// Satu titik pada grafik bulanan. Backend selalu mengirim 12 elemen,
// bulan tanpa transaksi bernilai nol. `total` adalah gabungan course + bootcamp;
// pecahannya dipakai untuk batang bertumpuk di grafik.
export interface RevenuePoint {
  period: string; // format YYYY-MM
  total: number;
  orders: number;
  course_total: number;
  bootcamp_total: number;
  course_orders: number;
  bootcamp_orders: number;
}

export interface RevenueTopCourse {
  courseId: string;
  title: string;
  cover_url: string | null;
  revenue: number;
  sold: number;
}

export interface RevenueTopBootcamp {
  batchId: string;
  title: string;        // nama package
  batch_title: string;
  image_url: string | null;
  revenue: number;
  sold: number;
}

export interface AdminRevenueReport {
  year: number;
  availableYears: number[];
  series: RevenuePoint[];
  topCourses: RevenueTopCourse[];
  topBootcamps: RevenueTopBootcamp[];
  summary: {
    total: number;
    courseTotal: number;
    bootcampTotal: number;
    paidOrders: number;
    avgOrderValue: number;
    conversionRate: number; // pecahan 0..1, bukan persen
    ordersByStatus: Partial<Record<'pending' | 'paid' | 'failed' | 'expired', number>>;
  };
}

export const adminGetDashboardStats = () =>
  apiClient.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard/stats');

export const adminGetRevenueReport = (params?: { year?: number }) =>
  apiClient.get<ApiResponse<AdminRevenueReport>>('/admin/dashboard/revenue', { params });
