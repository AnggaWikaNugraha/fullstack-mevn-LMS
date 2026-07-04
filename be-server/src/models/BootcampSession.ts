import { Schema, model, Document, Types } from 'mongoose';

export interface IBootcampSession extends Document {
  batchId: Types.ObjectId;
  title: string;
  session_name: string;
  session_date: Date;
  session_start_time: string; // format "HH:mm"
  session_end_time: string;   // format "HH:mm"
}

const bootcampSessionSchema = new Schema<IBootcampSession>(
  {
    batchId: { type: Schema.Types.ObjectId, ref: 'BootcampBatch', required: true, index: true },
    title: { type: String, required: true },
    session_name: { type: String, required: true },
    session_date: { type: Date, required: true },
    session_start_time: { type: String, required: true },
    session_end_time: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IBootcampSession>('BootcampSession', bootcampSessionSchema);
