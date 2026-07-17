import client from '@/api/client';
import type { ApiResponse } from '@/types/api';

export interface AdminQuizQuestion {
  _id: string;
  lessonId: string;
  question: string;
  options: string[];
  correct_index: number;
  order: number;
}

export type QuestionPayload = Pick<AdminQuizQuestion, 'question' | 'options' | 'correct_index'>;

export const adminGetQuizQuestions = (lessonId: string) =>
  client.get<ApiResponse<{ questions: AdminQuizQuestion[] }>>(`/admin/quiz/${lessonId}/questions`);

export const adminCreateQuestion = (lessonId: string, data: QuestionPayload) =>
  client.post(`/admin/quiz/${lessonId}/questions`, data);

export const adminUpdateQuestion = (questionId: string, data: QuestionPayload) =>
  client.patch(`/admin/quiz/questions/${questionId}`, data);

export const adminDeleteQuestion = (questionId: string) =>
  client.delete(`/admin/quiz/questions/${questionId}`);
