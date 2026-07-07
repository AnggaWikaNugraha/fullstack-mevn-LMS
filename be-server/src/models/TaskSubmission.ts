import { Schema, model, Document, Types } from 'mongoose';

export interface ITaskSubmission extends Document {
  userId: Types.ObjectId;
  lessonId: Types.ObjectId;
  courseId: Types.ObjectId;  // denormalisasi
  submission_url: string;
  note: string;
  status: 'submitted';       // Phase 3: auto-approve, tidak ada review
  submittedAt: Date;
}

const taskSubmissionSchema = new Schema<ITaskSubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    submission_url: { type: String, required: true },
    note: { type: String, default: '' },
    status: { type: String, enum: ['submitted'], default: 'submitted' },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Satu submission per user per lesson — overwrite jika submit ulang
taskSubmissionSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export default model<ITaskSubmission>('TaskSubmission', taskSubmissionSchema);
