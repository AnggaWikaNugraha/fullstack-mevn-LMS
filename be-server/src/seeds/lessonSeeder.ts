import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course';
import Module from '../models/Module';
import Chapter from '../models/Chapter';
import Lesson from '../models/Lesson';
import Progress from '../models/Progress';

dotenv.config();

// YouTube embed URL placeholder — replace with actual unlisted video URLs in production
const YT = (id: string) => `https://www.youtube.com/embed/${id}`;

// Seed structure for "Belajar Vue 3 dari Nol"
// 2 modules → 4 chapters → 14 lessons (12 video + 2 quiz = 7200s total)
const seedData = {
  courseTitle: 'Belajar Vue 3 dari Nol',
  modules: [
    {
      title: 'Modul 1: Fundamental JavaScript',
      order: 1,
      chapters: [
        {
          title: 'Bab 1: Dasar JavaScript',
          order: 1,
          lessons: [
            {
              title: 'Pengantar JavaScript',
              type: 'video' as const,
              order: 1,
              duration: 480, // 8 min
              video_url: YT('hdI2bqOjy3c'),
              description: 'Kenalan dengan JavaScript — bahasa pemrograman web paling populer di dunia.',
              is_locked: false, // first lesson is always unlocked
            },
            {
              title: 'Variabel & Tipe Data',
              type: 'video' as const,
              order: 2,
              duration: 600, // 10 min
              video_url: YT('PkZNo7MFNFg'),
              description: 'Pelajari var, let, const serta tipe data primitif di JavaScript.',
              is_locked: false,
            },
            {
              title: 'Quiz: Dasar JavaScript',
              type: 'quiz' as const,
              order: 3,
              duration: 0,
              video_url: null,
              description: 'Uji pemahaman kamu tentang variabel dan tipe data JavaScript.',
              is_locked: true,
            },
          ],
        },
        {
          title: 'Bab 2: Function & Array',
          order: 2,
          lessons: [
            {
              title: 'Function & Arrow Function',
              type: 'video' as const,
              order: 1,
              duration: 600, // 10 min
              video_url: YT('PoRJizFvM7s'),
              description: 'Memahami function declaration, expression, dan arrow function ES6.',
              is_locked: true,
            },
            {
              title: 'Array Methods Modern',
              type: 'video' as const,
              order: 2,
              duration: 720, // 12 min
              video_url: YT('R8rmfD9Y5-c'),
              description: 'map, filter, reduce, find, dan method array lainnya yang wajib dikuasai.',
              is_locked: true,
            },
          ],
        },
      ],
    },
    {
      title: 'Modul 2: Vue 3 Core',
      order: 2,
      chapters: [
        {
          title: 'Bab 3: Setup & Composition API',
          order: 1,
          lessons: [
            {
              title: 'Instalasi Vue 3 & Vite',
              type: 'video' as const,
              order: 1,
              duration: 480, // 8 min
              video_url: YT('VySFHm3znkQ'),
              description: 'Setup project Vue 3 dengan Vite sebagai build tool modern.',
              is_locked: true,
            },
            {
              title: 'ref & reactive',
              type: 'video' as const,
              order: 2,
              duration: 600, // 10 min
              video_url: YT('nhBVL41-_Cw'),
              description: 'Pahami perbedaan ref dan reactive untuk state management di Vue 3.',
              is_locked: true,
            },
            {
              title: 'computed & watch',
              type: 'video' as const,
              order: 3,
              duration: 600, // 10 min
              video_url: YT('juocN5K1F6k'),
              description: 'Derived state dengan computed properties dan side effects dengan watch.',
              is_locked: true,
            },
            {
              title: 'Quiz: Composition API',
              type: 'quiz' as const,
              order: 4,
              duration: 0,
              video_url: null,
              description: 'Uji pemahaman kamu tentang Composition API Vue 3.',
              is_locked: true,
            },
          ],
        },
        {
          title: 'Bab 4: Component & Router',
          order: 2,
          lessons: [
            {
              title: 'Props & Emit',
              type: 'video' as const,
              order: 1,
              duration: 720, // 12 min
              video_url: YT('4nY0R1a6M7w'),
              description: 'Komunikasi antar komponen dengan defineProps dan defineEmits.',
              is_locked: true,
            },
            {
              title: 'Slots & Provide/Inject',
              type: 'video' as const,
              order: 2,
              duration: 720, // 12 min
              video_url: YT('orAPczX0TJQ'),
              description: 'Pattern lanjutan untuk komposisi komponen yang fleksibel.',
              is_locked: true,
            },
            {
              title: 'Vue Router 4',
              type: 'video' as const,
              order: 3,
              duration: 600, // 10 min
              video_url: YT('GwkncHMVHfk'),
              description: 'Setup routing SPA dengan Vue Router — dynamic routes dan navigation guards.',
              is_locked: true,
            },
            {
              title: 'Pinia State Management',
              type: 'video' as const,
              order: 4,
              duration: 720, // 12 min
              video_url: YT('vZkH3kOsXW0'),
              description: 'Global state management yang ringan dan type-safe dengan Pinia.',
              is_locked: true,
            },
            {
              title: 'Build & Deploy ke Netlify',
              type: 'video' as const,
              order: 5,
              duration: 360, // 6 min
              video_url: YT('BVyZpRn8Tgg'),
              description: 'Build production bundle dan deploy Vue 3 app ke Netlify secara gratis.',
              is_locked: true,
            },
          ],
        },
      ],
    },
  ],
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Find the target course
    const course = await Course.findOne({ title: seedData.courseTitle });
    if (!course) {
      console.error(`Course "${seedData.courseTitle}" not found. Run seed:courses first.`);
      process.exit(1);
    }

    const courseId = course._id;

    // Clear existing lesson data for this course to keep seeder idempotent
    const existingModules = await Module.find({ courseId });
    const existingModuleIds = existingModules.map((m) => m._id);
    const existingChapters = await Chapter.find({ moduleId: { $in: existingModuleIds } });
    const existingChapterIds = existingChapters.map((c) => c._id);

    await Promise.all([
      Progress.deleteMany({ courseId }),
      Lesson.deleteMany({ chapterId: { $in: existingChapterIds } }),
      Chapter.deleteMany({ moduleId: { $in: existingModuleIds } }),
      Module.deleteMany({ courseId }),
    ]);
    console.log(`Cleared existing lesson data for "${seedData.courseTitle}"`);

    // Insert modules, chapters, lessons while tracking totals
    let totalLessons = 0;
    let totalDuration = 0;
    let totalVideos = 0;

    for (const moduleData of seedData.modules) {
      let moduleDuration = 0;

      const module = await Module.create({
        courseId,
        title: moduleData.title,
        order: moduleData.order,
      });

      for (const chapterData of moduleData.chapters) {
        let chapterDuration = 0;

        const chapter = await Chapter.create({
          moduleId: module._id,
          title: chapterData.title,
          order: chapterData.order,
        });

        for (const lessonData of chapterData.lessons) {
          await Lesson.create({
            chapterId: chapter._id,
            courseId,
            title: lessonData.title,
            type: lessonData.type,
            order: lessonData.order,
            duration: lessonData.duration,
            video_url: lessonData.video_url,
            description: lessonData.description,
            is_locked: lessonData.is_locked,
          });

          totalLessons++;
          totalDuration += lessonData.duration;
          chapterDuration += lessonData.duration;
          if (lessonData.type === 'video') totalVideos++;
        }

        // Update chapter duration after all lessons are inserted
        await Chapter.findByIdAndUpdate(chapter._id, { chapter_duration: chapterDuration });
        moduleDuration += chapterDuration;
      }

      await Module.findByIdAndUpdate(module._id, { module_duration: moduleDuration });
    }

    // Sync course-level stats to match the seeded content
    await Course.findByIdAndUpdate(courseId, {
      total_lessons: totalLessons,
      video_amount: totalVideos,
      course_duration: totalDuration,
    });

    console.log(`Seeded ${totalLessons} lessons (${totalVideos} videos) for "${seedData.courseTitle}"`);
    console.log(`Total duration: ${Math.round(totalDuration / 60)} minutes`);

    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
