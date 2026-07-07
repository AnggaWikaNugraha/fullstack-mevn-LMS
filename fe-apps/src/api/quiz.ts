import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type { QuizQuestion, QuizSubmitPayload, QuizAttemptResult } from '@/types/quiz';

export const getQuizQuestions = (lessonId: string) =>
  apiClient.get<ApiResponse<{ questions: QuizQuestion[] }>>(`/quiz/${lessonId}/questions`);

export const submitQuizAnswers = (lessonId: string, payload: QuizSubmitPayload) =>
  apiClient.post<ApiResponse<{ attempt: QuizAttemptResult }>>(`/quiz/${lessonId}/submit`, payload);

export const getMyAttempt = (lessonId: string) =>
  apiClient.get<ApiResponse<{ attempt: QuizAttemptResult | null }>>(`/quiz/${lessonId}/my-attempt`);
