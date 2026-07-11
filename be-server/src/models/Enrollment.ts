import { Schema, model, Document, Types } from 'mongoose';

export interface IEnrollment extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  orderId: Types.ObjectId;
  enrolledAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Satu user hanya bisa punya satu enrollment per course
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default model<IEnrollment>('Enrollment', enrollmentSchema);
