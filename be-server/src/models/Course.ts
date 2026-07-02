import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  cover_url: string;
  topic: string;
  topic_name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isFree: boolean;
  video_amount: number;
  total_lessons: number;
  course_duration: number; // total duration of all videos in seconds
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    cover_url: { type: String, required: true },
    topic: { type: String, required: true },         // slug, e.g. "web-dev"
    topic_name: { type: String, required: true },    // display name, e.g. "Web Development"
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    isFree: { type: Boolean, default: false },
    video_amount: { type: Number, default: 0 },
    total_lessons: { type: Number, default: 0 },
    course_duration: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ICourse>('Course', CourseSchema);
