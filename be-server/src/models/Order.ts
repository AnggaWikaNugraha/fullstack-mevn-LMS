import { Schema, model, Document, Types } from 'mongoose';

export interface IOrder extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  amount: number;                // harga terkunci saat order dibuat
  status: 'pending' | 'paid' | 'failed' | 'expired';
  snap_token: string;            // Midtrans Snap token
  midtrans_order_id: string;     // ID unik untuk Midtrans
  paidAt: Date | null;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'expired'],
      default: 'pending',
    },
    snap_token: { type: String, required: true },
    midtrans_order_id: { type: String, required: true, unique: true },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, courseId: 1, status: 1 });

export default model<IOrder>('Order', orderSchema);
