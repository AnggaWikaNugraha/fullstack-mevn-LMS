import { Schema, model, Document, Types } from 'mongoose';

export interface IBootcampBatch extends Document {
  packageId: Types.ObjectId;
  title: string;
  sub_title: string;
  description: string;
  started_at: Date;
  ended_at: Date;
  quota_used_percentage: number; // 0–100, diisi manual oleh admin
  price: number;
  strikethrough_price: number;   // 0 = tidak ada diskon, tampil harga normal saja
  package_type: 'online' | 'offline' | 'hybrid';
}

const bootcampBatchSchema = new Schema<IBootcampBatch>(
  {
    packageId: { type: Schema.Types.ObjectId, ref: 'BootcampPackage', required: true, index: true },
    title: { type: String, required: true },
    sub_title: { type: String, default: '' },
    description: { type: String, default: '' },
    started_at: { type: Date, required: true },
    ended_at: { type: Date, required: true },
    quota_used_percentage: { type: Number, default: 0, min: 0, max: 100 },
    price: { type: Number, required: true },
    strikethrough_price: { type: Number, default: 0 },
    package_type: { type: String, enum: ['online', 'offline', 'hybrid'], default: 'online' },
  },
  { timestamps: true }
);

export default model<IBootcampBatch>('BootcampBatch', bootcampBatchSchema);
