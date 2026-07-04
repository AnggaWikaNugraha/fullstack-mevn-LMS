import { Schema, model, Document, Types } from 'mongoose';

export interface ILesson extends Document {
  chapterId: Types.ObjectId;
  courseId: Types.ObjectId;   // denormalisasi — dipakai di getCourseProgress dan simpan ke Progress
  title: string;
  type: 'video' | 'quiz';
  order: number;
  duration: number;           // durasi dalam detik (0 untuk quiz)
  video_url: string | null;   // URL embed YouTube lengkap, null untuk tipe quiz
  description: string;
  is_locked: boolean;         // false = preview gratis (selalu terbuka); true = dikunci oleh progress sequential
}

const lessonSchema = new Schema<ILesson>(
  {
    chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'quiz'], required: true },
    order: { type: Number, required: true },
    duration: { type: Number, default: 0 },
    video_url: { type: String, default: null },
    description: { type: String, default: '' },
    is_locked: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model<ILesson>('Lesson', lessonSchema);
