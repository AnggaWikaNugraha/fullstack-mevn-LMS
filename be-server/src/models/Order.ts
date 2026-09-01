import { Schema, model, Document, Types } from 'mongoose';

export interface IOrder extends Document {
  userId: Types.ObjectId;
  type: 'course' | 'bootcamp';
  courseId?: Types.ObjectId;     // hanya untuk type 'course'
  batchId?: Types.ObjectId;      // hanya untuk type 'bootcamp'
  amount: number;                // harga terkunci saat order dibuat
  status: 'pending' | 'paid' | 'failed' | 'expired';
  snap_token: string;            // Midtrans Snap token
  midtrans_order_id: string;     // ID unik untuk Midtrans
  paidAt: Date | null;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Order lama tidak punya field ini, jadi bawaannya 'course' agar tetap terbaca
    // sebagai penjualan course tanpa perlu migrasi data
    type: { type: String, enum: ['course', 'bootcamp'], default: 'course' },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: function (this: IOrder) {
        return this.type === 'course';
      },
    },
    batchId: {
      type: Schema.Types.ObjectId,
      ref: 'BootcampBatch',
      required: function (this: IOrder) {
        return this.type === 'bootcamp';
      },
    },
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

// Cerminan indeks di atas untuk sisi bootcamp — melayani pencarian order pending
// milik user pada satu batch saat checkout diulang
orderSchema.index({ userId: 1, batchId: 1, status: 1 });

// Laporan pendapatan menyaring status + rentang paidAt tanpa userId,
// jadi indeks di atas tidak terpakai untuk kueri itu
orderSchema.index({ status: 1, paidAt: -1 });

export default model<IOrder>('Order', orderSchema);
