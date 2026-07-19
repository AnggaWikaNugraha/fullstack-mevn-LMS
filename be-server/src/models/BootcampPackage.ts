import { Schema, model, Document, Types } from 'mongoose';

// Mentor disimpan sebagai ref ke User — bukan embedded string
export interface IMentorRef {
  userId: Types.ObjectId;
  occupation: string;
}

export interface IBootcampPackage extends Document {
  title: string;
  description: string;
  image_url: string;
  status: 'open' | 'coming_soon' | 'closed';
  mentors: IMentorRef[];
}

const mentorRefSchema = new Schema<IMentorRef>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    occupation: { type: String, required: true },
  },
  { _id: false }
);

const bootcampPackageSchema = new Schema<IBootcampPackage>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image_url: { type: String, default: '' },
    status: { type: String, enum: ['open', 'coming_soon', 'closed'], default: 'coming_soon' },
    mentors: { type: [mentorRefSchema], default: [] },
  },
  { timestamps: true }
);

export default model<IBootcampPackage>('BootcampPackage', bootcampPackageSchema);
