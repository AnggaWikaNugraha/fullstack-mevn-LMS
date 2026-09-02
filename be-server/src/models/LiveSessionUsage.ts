import { Schema, model, Document, Types } from 'mongoose';

export interface ILiveSessionUsage extends Document {
  userId: Types.ObjectId;
  sessionId: Types.ObjectId;
  minutes: number;    // estimasi menit yang dipesan saat token diterbitkan
  createdAt: Date;
}

const liveSessionUsageSchema = new Schema<ILiveSessionUsage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'BootcampSession', required: true },
    minutes: { type: Number, required: true },
  },
  { timestamps: true }
);

// Satu baris per user per sesi — user yang me-refresh halaman tidak terhitung dua kali
liveSessionUsageSchema.index({ userId: 1, sessionId: 1 }, { unique: true });
// Penjumlahan pemakaian selalu dibatasi rentang bulan berjalan
liveSessionUsageSchema.index({ createdAt: 1 });

export default model<ILiveSessionUsage>('LiveSessionUsage', liveSessionUsageSchema);
