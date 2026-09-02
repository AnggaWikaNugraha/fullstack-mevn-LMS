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
  isEnrolled: boolean;
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
  // true bila user terdaftar di salah satu batch package ini
  isEnrolled: boolean;
}

export interface BootcampListResponse {
  bootcamps: BootcampPackage[];
  pagination: Pagination;
}

export interface BootcampDetailResponse {
  bootcamp: BootcampPackage;
}

export interface BootcampEnrollmentStatus {
  isEnrolled: boolean;
  enrolledAt: string | null;
}

// ── Bootcamp Saya ────────────────────────────────────────────────────────────

// Batch dan package bisa bernilai null bila admin menghapusnya setelah user
// mendaftar — kartu tetap ditampilkan dengan label pengganti
export interface MyBootcampEnrollment {
  enrollment_id: string;
  enrolled_at: string;
  package: {
    _id: string;
    title: string;
    image_url: string;
    status: 'open' | 'coming_soon' | 'closed';
  } | null;
  batch: {
    _id: string;
    title: string;
    sub_title: string;
    started_at: string;
    ended_at: string;
    package_type: 'online' | 'offline' | 'hybrid';
  } | null;
  status: 'upcoming' | 'ongoing' | 'finished';
  total_sessions: number;
  upcoming_session: BootcampSession | null;
  sessions: BootcampSession[];
}

export interface MyBootcampsResponse {
  bootcamps: MyBootcampEnrollment[];
}

// ── Live Session (Agora RTC) ────────────────────────────────────────────────

// Peran ditentukan server per sesi — bukan diturunkan dari User.role, karena
// seseorang bisa jadi mentor di satu bootcamp dan peserta biasa di bootcamp lain
export interface LiveSessionToken {
  token: string;
  appId: string;
  channelName: string;
  uid: number;
  role: 'host' | 'participant';
  session: {
    _id: string;
    title: string;
    session_name: string;
    session_date: string;
    session_start_time: string;
    session_end_time: string;
  };
}
