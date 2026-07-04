import { Schema, model, Document, Types } from 'mongoose';

export interface IProgress extends Document {
  userId: Types.ObjectId;
  lessonId: Types.ObjectId;
  courseId: Types.ObjectId; // denormalisasi untuk query cepat di level kurs
  completedAt: Date;
}

const progressSchema = new Schema<IProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Cegah duplikasi progress record per user per lesson
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
progressSchema.index({ userId: 1, courseId: 1 });

export default model<IProgress>('Progress', progressSchema);
