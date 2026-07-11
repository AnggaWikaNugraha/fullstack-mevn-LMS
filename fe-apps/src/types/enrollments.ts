import type { Course } from './courses';

export interface MyCourse {
  enrollment_id: string;
  enrolled_at: string;
  completed_lessons: number;
  course: Course;
}

export interface MyCoursesResponse {
  courses: MyCourse[];
}
