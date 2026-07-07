// ─── Course List ─────────────────────────────────────────────────────────────

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

// ─── Course Detail ────────────────────────────────────────────────────────────

export interface Lesson {
  _id: string;
  title: string;
  type: 'video' | 'quiz' | 'task';
  order: number;
  duration: number;    // seconds
  video_url: string | null;
  description: string;
  passing_score: number; // nilai minimum lulus quiz (default 70)
  is_done: boolean;    // injected by BE based on user Progress
  is_locked: boolean;  // injected by BE: false when previous lesson is completed
}

export interface Chapter {
  _id: string;
  title: string;
  order: number;
  chapter_duration: number;
  lessons: Lesson[];
}

export interface Module {
  _id: string;
  title: string;
  order: number;
  module_duration: number;
  chapters: Chapter[];
}

export interface CourseDetail extends Course {
  modules: Module[];
}

export interface CourseDetailResponse {
  course: CourseDetail;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface CourseProgressResponse {
  completed_lessons: number;
  total_lessons: number;
  percentage: number;
}
