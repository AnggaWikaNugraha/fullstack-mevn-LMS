import apiClient from '../client';
import type { ApiResponse } from '@/types/api';

// Mentor user (untuk dropdown picker di form)
export interface MentorUser {
  _id: string;
  name: string;
  avatar_url: string | null;
}

// Mentor yang tersimpan di package — userId ter-populate dari User
export interface AdminMentor {
  userId: MentorUser;
  occupation: string;
}

// Payload saat kirim ke BE — hanya butuh userId string + occupation
export interface AdminMentorPayload {
  userId: string;
  occupation: string;
}

export interface AdminBootcampSession {
  _id: string;
  batchId: string;
  title: string;
  session_name: string;
  session_date: string;
  session_start_time: string;
  session_end_time: string;
}

export interface AdminBootcampBatch {
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
  sessions: AdminBootcampSession[];
}

export interface AdminBootcampPackage {
  _id: string;
  title: string;
  description: string;
  image_url: string;
  status: 'open' | 'coming_soon' | 'closed';
  mentors: AdminMentor[];
  batch_count: number;
  createdAt: string;
}

export interface AdminBootcampDetail extends Omit<AdminBootcampPackage, 'batch_count'> {
  batches: AdminBootcampBatch[];
}

export type PackagePayload = {
  title: string;
  description: string;
  image_url: string;
  status: 'open' | 'coming_soon' | 'closed';
  mentors: AdminMentorPayload[];
};

export type BatchPayload = {
  title: string;
  sub_title?: string;
  description?: string;
  started_at: string;
  ended_at: string;
  quota_used_percentage?: number;
  price: number;
  strikethrough_price?: number;
  package_type: 'online' | 'offline' | 'hybrid';
};

export type SessionPayload = {
  title: string;
  session_name: string;
  session_date: string;
  session_start_time: string;
  session_end_time: string;
};

// Mentors (users dengan role mentor)
export const adminListMentors = () =>
  apiClient.get<ApiResponse<{ mentors: MentorUser[] }>>('/admin/bootcamps/mentors');

// Package
export const adminListBootcamps = () =>
  apiClient.get<ApiResponse<{ packages: AdminBootcampPackage[] }>>('/admin/bootcamps');

export const adminGetBootcamp = (id: string) =>
  apiClient.get<ApiResponse<{ package: AdminBootcampDetail }>>(`/admin/bootcamps/${id}`);

export const adminCreateBootcamp = (payload: PackagePayload) =>
  apiClient.post<ApiResponse<{ package: AdminBootcampPackage }>>('/admin/bootcamps', payload);

export const adminUpdateBootcamp = (id: string, payload: Partial<PackagePayload>) =>
  apiClient.patch<ApiResponse<{ package: AdminBootcampPackage }>>(`/admin/bootcamps/${id}`, payload);

export const adminDeleteBootcamp = (id: string) =>
  apiClient.delete<ApiResponse<null>>(`/admin/bootcamps/${id}`);

// Batch
export const adminCreateBatch = (packageId: string, payload: BatchPayload) =>
  apiClient.post(`/admin/bootcamps/${packageId}/batches`, payload);

export const adminUpdateBatch = (id: string, payload: Partial<BatchPayload>) =>
  apiClient.patch(`/admin/bootcamps/batches/${id}`, payload);

export const adminDeleteBatch = (id: string) =>
  apiClient.delete(`/admin/bootcamps/batches/${id}`);

// Session
export const adminCreateSession = (batchId: string, payload: SessionPayload) =>
  apiClient.post(`/admin/bootcamps/batches/${batchId}/sessions`, payload);

export const adminUpdateSession = (id: string, payload: Partial<SessionPayload>) =>
  apiClient.patch(`/admin/bootcamps/sessions/${id}`, payload);

export const adminDeleteSession = (id: string) =>
  apiClient.delete(`/admin/bootcamps/sessions/${id}`);
