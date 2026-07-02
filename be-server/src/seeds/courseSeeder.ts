import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course';

dotenv.config();

const courses = [
  {
    title: 'Belajar Vue 3 dari Nol',
    description: 'Kuasai Vue 3 dengan Composition API, Pinia, dan Vue Router. Cocok untuk pemula yang ingin membangun aplikasi web modern.',
    cover_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    topic: 'web-dev',
    topic_name: 'Web Development',
    level: 'beginner',
    isFree: true,
    video_amount: 12,
    total_lessons: 14,
    course_duration: 7200,
  },
  {
    title: 'Node.js & Express REST API',
    description: 'Bangun REST API production-ready dengan Node.js, Express, MongoDB, dan JWT authentication.',
    cover_url: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800',
    topic: 'backend',
    topic_name: 'Backend Development',
    level: 'intermediate',
    isFree: false,
    video_amount: 18,
    total_lessons: 20,
    course_duration: 10800,
  },
  {
    title: 'TypeScript untuk Pemula',
    description: 'Pelajari TypeScript dari dasar — type system, interface, generics, dan integrasi dengan project JavaScript yang sudah ada.',
    cover_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    topic: 'web-dev',
    topic_name: 'Web Development',
    level: 'beginner',
    isFree: true,
    video_amount: 10,
    total_lessons: 12,
    course_duration: 5400,
  },
  {
    title: 'React Native Mobile App',
    description: 'Buat aplikasi mobile cross-platform dengan React Native. Dari setup hingga deploy ke App Store dan Play Store.',
    cover_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    topic: 'mobile',
    topic_name: 'Mobile Development',
    level: 'intermediate',
    isFree: false,
    video_amount: 22,
    total_lessons: 25,
    course_duration: 14400,
  },
  {
    title: 'UI/UX Design dengan Figma',
    description: 'Desain interface yang menarik dan user-friendly menggunakan Figma. Termasuk prototyping dan design system.',
    cover_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    topic: 'design',
    topic_name: 'UI/UX Design',
    level: 'beginner',
    isFree: true,
    video_amount: 8,
    total_lessons: 10,
    course_duration: 4800,
  },
  {
    title: 'Python untuk Data Science',
    description: 'Analisis data dan machine learning dengan Python, Pandas, NumPy, dan Scikit-learn.',
    cover_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    topic: 'data-science',
    topic_name: 'Data Science',
    level: 'intermediate',
    isFree: false,
    video_amount: 20,
    total_lessons: 24,
    course_duration: 12600,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    await Course.deleteMany({});
    console.log('Cleared existing courses');

    await Course.insertMany(courses);
    console.log(`Seeded ${courses.length} courses`);

    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
