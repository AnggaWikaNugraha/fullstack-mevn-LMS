import { Schema, model, Document, Types } from 'mongoose';

export interface IQuizQuestion extends Document {
  lessonId: Types.ObjectId;
  question: string;
  options: string[];      // selalu 4 pilihan
  correct_index: number;  // 0–3, tidak pernah dikirim ke FE
  order: number;
}

const quizQuestionSchema = new Schema<IQuizQuestion>(
  {
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true, index: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correct_index: { type: Number, required: true, min: 0, max: 3 },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model<IQuizQuestion>('QuizQuestion', quizQuestionSchema);
