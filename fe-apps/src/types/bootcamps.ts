import type { Pagination } from './api';

export interface BootcampMentor {
  name: string;
  image_url: string;
  occupation: string;
}

export interface BootcampSession {
  _id: string;
  batchId: string;
  title: string;
  session_name: string;
  session_date: string;        // ISO date string
  session_start_time: string;  // "HH:mm"
  session_end_time: string;    // "HH:mm"
}

export interface BootcampBatch {
  _id: string;
  packageId: string;
  title: string;
  sub_title: string;
  description: string;
  started_at: string;
  ended_at: string;
  quota_used_percentage: number;
  price: number;
  strikethrough_price: number;
  package_type: 'online' | 'offline' | 'hybrid';
  sessions: BootcampSession[];
}

export interface BootcampPackage {
  _id: string;
  title: string;
  description: string;
  image_url: string;
  status: 'open' | 'coming_soon' | 'closed';
  mentors: BootcampMentor[];
  batches: BootcampBatch[];
  createdAt: string;
}

export interface BootcampListResponse {
  bootcamps: BootcampPackage[];
  pagination: Pagination;
}

export interface BootcampDetailResponse {
  bootcamp: BootcampPackage;
}
