import { Schema, model, Document } from 'mongoose';

// Mentor disimpan embedded — tidak perlu koleksi terpisah
export interface IMentor {
  name: string;
  image_url: string;
  occupation: string;
}

export interface IBootcampPackage extends Document {
  title: string;
  description: string;
  image_url: string;
  status: 'open' | 'coming_soon' | 'closed';
  mentors: IMentor[];
}

const mentorSchema = new Schema<IMentor>(
  {
    name: { type: String, required: true },
    image_url: { type: String, required: true },
    occupation: { type: String, required: true },
  },
  { _id: false }
);

const bootcampPackageSchema = new Schema<IBootcampPackage>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image_url: { type: String, required: true },
    status: { type: String, enum: ['open', 'coming_soon', 'closed'], default: 'coming_soon' },
    mentors: { type: [mentorSchema], default: [] },
  },
  { timestamps: true }
);

export default model<IBootcampPackage>('BootcampPackage', bootcampPackageSchema);
