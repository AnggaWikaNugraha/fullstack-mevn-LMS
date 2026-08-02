import mongoose, { Document, Schema } from 'mongoose';

export interface ITopic extends Document {
  slug: string;
  name: string;
}

const TopicSchema = new Schema<ITopic>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITopic>('Topic', TopicSchema);
