import { Schema, model, Document, Types } from 'mongoose';

export interface IChapter extends Document {
  moduleId: Types.ObjectId;
  title: string;
  order: number;
  chapter_duration: number; // total durasi semua lesson di bab ini (detik)
}

const chapterSchema = new Schema<IChapter>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
    title: { type: String, required: true },
    order: { type: Number, required: true },
    chapter_duration: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model<IChapter>('Chapter', chapterSchema);
