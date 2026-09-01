import { Schema, model, Document, Types } from 'mongoose';

export interface IBootcampEnrollment extends Document {
  userId: Types.ObjectId;
  packageId: Types.ObjectId;   // didenormalisasi dari batch.packageId
  batchId: Types.ObjectId;
  orderId: Types.ObjectId;
  enrolledAt: Date;
}

const bootcampEnrollmentSchema = new Schema<IBootcampEnrollment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Disalin dari batch supaya daftar "Bootcamp Saya" tidak perlu lookup batch
    // hanya untuk tahu package induknya
    packageId: { type: Schema.Types.ObjectId, ref: 'BootcampPackage', required: true },
    batchId: { type: Schema.Types.ObjectId, ref: 'BootcampBatch', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Satu user hanya bisa punya satu enrollment per batch. Batch lain dari package
// yang sama tetap boleh dibeli terpisah.
bootcampEnrollmentSchema.index({ userId: 1, batchId: 1 }, { unique: true });

export default model<IBootcampEnrollment>('BootcampEnrollment', bootcampEnrollmentSchema);
