import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson';
import QuizQuestion from '../models/QuizQuestion';

dotenv.config();

// Soal untuk dua lesson quiz yang sudah ada dari lessonSeeder
const quizData: { lessonTitle: string; passingScore: number; questions: { question: string; options: string[]; correct_index: number; order: number }[] }[] = [
  {
    lessonTitle: 'Quiz: Dasar JavaScript',
    passingScore: 60,
    questions: [
      {
        question: 'Apa perbedaan utama antara `let` dan `var` di JavaScript?',
        options: [
          '`let` memiliki block scope, `var` memiliki function scope',
          '`let` hanya untuk angka, `var` untuk semua tipe',
          '`var` lebih baru dari `let`',
          'Tidak ada perbedaan',
        ],
        correct_index: 0,
        order: 1,
      },
      {
        question: 'Manakah yang merupakan tipe data primitif di JavaScript?',
        options: ['Array', 'Object', 'Function', 'Boolean'],
        correct_index: 3,
        order: 2,
      },
      {
        question: 'Apa output dari `typeof null`?',
        options: ['"null"', '"undefined"', '"object"', '"boolean"'],
        correct_index: 2,
        order: 3,
      },
      {
        question: 'Manakah cara yang benar untuk mendeklarasikan konstanta?',
        options: ['let PI = 3.14', 'const PI = 3.14', 'var PI = 3.14', 'constant PI = 3.14'],
        correct_index: 1,
        order: 4,
      },
      {
        question: 'Apa yang dimaksud dengan `undefined` di JavaScript?',
        options: [
          'Nilai yang sengaja dikosongkan',
          'Error saat program berjalan',
          'Variabel yang sudah dideklarasi tapi belum diberi nilai',
          'Tipe data khusus untuk angka tidak valid',
        ],
        correct_index: 2,
        order: 5,
      },
    ],
  },
  {
    lessonTitle: 'Quiz: Composition API',
    passingScore: 60,
    questions: [
      {
        question: 'Apa perbedaan utama antara `ref` dan `reactive` di Vue 3?',
        options: [
          '`ref` untuk objek, `reactive` untuk nilai primitif',
          '`ref` untuk nilai primitif (diakses via `.value`), `reactive` untuk objek',
          'Keduanya sama persis',
          '`reactive` sudah deprecated di Vue 3',
        ],
        correct_index: 1,
        order: 1,
      },
      {
        question: 'Kapan sebaiknya menggunakan `computed` di Vue 3?',
        options: [
          'Untuk menjalankan side effect saat data berubah',
          'Untuk membuat nilai yang diturunkan dari state lain secara reaktif',
          'Untuk memanggil API ke server',
          'Untuk mendefinisikan props komponen',
        ],
        correct_index: 1,
        order: 2,
      },
      {
        question: 'Apa fungsi `watch` di Composition API?',
        options: [
          'Membuat variabel reaktif',
          'Menghitung nilai berdasarkan state lain',
          'Menjalankan efek samping saat reactive source berubah',
          'Mendefinisikan event emitter',
        ],
        correct_index: 2,
        order: 3,
      },
      {
        question: 'Manakah cara yang benar mendefinisikan props di `<script setup>`?',
        options: [
          'props: { title: String }',
          'const props = defineProps<{ title: string }>()',
          'this.$props.title',
          'import props from "vue"',
        ],
        correct_index: 1,
        order: 4,
      },
      {
        question: 'Apa keuntungan utama menggunakan `<script setup>` di Vue 3?',
        options: [
          'Bisa menggunakan Options API bersamaan',
          'Semua binding otomatis ter-expose ke template tanpa return',
          'Hanya bisa dipakai di Vue 3.2+',
          'Menggantikan fungsi computed sepenuhnya',
        ],
        correct_index: 1,
        order: 5,
      },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    let totalQuestions = 0;

    for (const data of quizData) {
      // Cari lesson quiz berdasarkan judul
      const lesson = await Lesson.findOne({ title: data.lessonTitle, type: 'quiz' });
      if (!lesson) {
        console.warn(`Lesson "${data.lessonTitle}" not found — skip`);
        continue;
      }

      // Update passing_score di lesson
      await Lesson.findByIdAndUpdate(lesson._id, { passing_score: data.passingScore });

      // Hapus soal lama agar idempotent
      await QuizQuestion.deleteMany({ lessonId: lesson._id });

      // Insert soal baru
      for (const q of data.questions) {
        await QuizQuestion.create({ lessonId: lesson._id, ...q });
        totalQuestions++;
      }

      console.log(`Seeded ${data.questions.length} questions for "${data.lessonTitle}"`);
    }

    console.log(`Total: ${totalQuestions} questions seeded`);
    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
