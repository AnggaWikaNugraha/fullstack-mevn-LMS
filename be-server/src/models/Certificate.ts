import { Schema, model, Document, Types } from 'mongoose';

export interface ICertificate extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  certificateId: string;   // UUID v4 — dicetak di sertifikat untuk verifikasi
  issuedAt: Date;
}

const certificateSchema = new Schema<ICertificate>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    certificateId: { type: String, required: true, unique: true },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Satu sertifikat per user per course — upsert berkali-kali tidak menerbitkan ulang
certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default model<ICertificate>('Certificate', certificateSchema);
