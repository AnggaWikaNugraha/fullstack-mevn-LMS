// ─── Course ──────────────────────────────────────────────────────────────────

export interface Course {
  _id: string;
  title: string;
  description: string;
  cover_url: string;
  topic: string;
  topic_name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isFree: boolean;
  video_amount: number;
  total_lessons: number;
  course_duration: number;
  createdAt: string;
}

// ─── Topic ────────────────────────────────────────────────────────────────────

export interface Topic {
  topic: string;
  topic_name: string;
}

import type { Pagination } from './api';

export interface CourseListResponse {
  courses: Course[];
  pagination: Pagination;
}
