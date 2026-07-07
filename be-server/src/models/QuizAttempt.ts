import { Schema, model, Document, Types } from 'mongoose';

export interface IQuizAttempt extends Document {
  userId: Types.ObjectId;
  lessonId: Types.ObjectId;
  courseId: Types.ObjectId;  // denormalisasi untuk query cepat
  answers: number[];         // index jawaban user per soal, urut sesuai order soal
  score: number;             // 0–100
  passed: boolean;
  attemptedAt: Date;
}

const quizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    answers: { type: [Number], required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    passed: { type: Boolean, required: true },
    attemptedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Tidak ada unique index — user boleh retry berkali-kali
quizAttemptSchema.index({ userId: 1, lessonId: 1 });

export default model<IQuizAttempt>('QuizAttempt', quizAttemptSchema);
