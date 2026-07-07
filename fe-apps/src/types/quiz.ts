// ─── Quiz ─────────────────────────────────────────────────────────────────────

export interface QuizQuestion {
  _id: string;
  lessonId: string;
  question: string;
  options: string[];
  order: number;
  // correct_index tidak pernah dikirim dari BE
}

export interface QuizSubmitPayload {
  answers: number[]; // index jawaban per soal, urutan sesuai questions
}

export interface QuizAttemptResult {
  score: number;        // 0–100
  passed: boolean;
  correct_count: number;
  total_questions: number;
  attemptedAt: string;
}

// ─── Task ─────────────────────────────────────────────────────────────────────

export interface TaskSubmitPayload {
  submission_url: string;
  note?: string;
}

export interface TaskSubmission {
  _id: string;
  lessonId: string;
  submission_url: string;
  note: string;
  status: 'submitted';
  submittedAt: string;
}
