import { Schema, model, Document, Types } from 'mongoose';

export interface IModule extends Document {
  courseId: Types.ObjectId;
  title: string;
  order: number;
  module_duration: number; // total durasi semua lesson di modul ini (detik)
}

const moduleSchema = new Schema<IModule>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true },
    order: { type: Number, required: true },
    module_duration: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model<IModule>('Module', moduleSchema);
