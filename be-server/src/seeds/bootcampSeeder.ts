import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BootcampPackage from '../models/BootcampPackage';
import BootcampBatch from '../models/BootcampBatch';
import BootcampSession from '../models/BootcampSession';
import User from '../models/User';

dotenv.config();

const daysFromNow = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Ambil mentor user berdasarkan email — harus jalankan seed:mentors dulu
    const [andi, sari, budi, rina, dian] = await Promise.all([
      User.findOne({ email: 'andi.pratama@mentor.com' }),
      User.findOne({ email: 'sari.dewi@mentor.com' }),
      User.findOne({ email: 'budi.santoso@mentor.com' }),
      User.findOne({ email: 'rina.kusuma@mentor.com' }),
      User.findOne({ email: 'dian.purnama@mentor.com' }),
    ]);

    if (!andi || !sari || !budi || !rina || !dian) {
      console.error('Mentor users tidak ditemukan. Jalankan dulu: npm run seed:mentors');
      process.exit(1);
    }

    // Bersihkan data lama
    await Promise.all([
      BootcampSession.deleteMany({}),
      BootcampBatch.deleteMany({}),
      BootcampPackage.deleteMany({}),
    ]);
    console.log('Cleared existing bootcamp data');

    const seedData = [
      {
        package: {
          title: 'Bootcamp Full-Stack Web Development',
          description:
            'Program intensif 3 bulan untuk menjadi Full-Stack Developer. Mulai dari HTML/CSS hingga membangun REST API dengan Node.js dan Vue.js. Dilengkapi job placement support dan portofolio project nyata.',
          image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
          status: 'open' as const,
          mentors: [
            { userId: andi._id, occupation: 'Senior Frontend Engineer @ Tokopedia' },
            { userId: sari._id, occupation: 'Backend Engineer @ Gojek' },
          ],
        },
        batches: [
          {
            title: 'Batch 5',
            sub_title: 'Januari 2025',
            description: 'Batch reguler dengan kuota 30 peserta. Kelas setiap Sabtu-Minggu pagi.',
            started_at: daysFromNow(14),
            ended_at: daysFromNow(104),
            quota_used_percentage: 70,
            price: 5500000,
            strikethrough_price: 7500000,
            package_type: 'online' as const,
            sessions: [
              { title: 'Sesi 1', session_name: 'Kickoff & Web Fundamentals', session_start_time: '09:00', session_end_time: '12:00', daysOffset: 14 },
              { title: 'Sesi 2', session_name: 'HTML & CSS Deep Dive', session_start_time: '09:00', session_end_time: '12:00', daysOffset: 21 },
              { title: 'Sesi 3', session_name: 'JavaScript ES6+', session_start_time: '09:00', session_end_time: '12:00', daysOffset: 28 },
              { title: 'Sesi 4', session_name: 'Vue 3 & Composition API', session_start_time: '09:00', session_end_time: '12:00', daysOffset: 35 },
              { title: 'Sesi 5', session_name: 'Node.js & REST API', session_start_time: '09:00', session_end_time: '12:00', daysOffset: 42 },
              { title: 'Sesi 6', session_name: 'Database dengan MongoDB', session_start_time: '09:00', session_end_time: '12:00', daysOffset: 49 },
              { title: 'Sesi 7', session_name: 'Authentication & Security', session_start_time: '09:00', session_end_time: '12:00', daysOffset: 56 },
              { title: 'Sesi 8', session_name: 'Final Project & Demo Day', session_start_time: '09:00', session_end_time: '14:00', daysOffset: 63 },
            ],
          },
          {
            title: 'Batch 6',
            sub_title: 'April 2025',
            description: 'Batch berikutnya — daftar sekarang dan dapatkan harga early bird.',
            started_at: daysFromNow(104),
            ended_at: daysFromNow(194),
            quota_used_percentage: 20,
            price: 5500000,
            strikethrough_price: 7500000,
            package_type: 'online' as const,
            sessions: [
              { title: 'Sesi 1', session_name: 'Kickoff & Web Fundamentals', session_start_time: '09:00', session_end_time: '12:00', daysOffset: 104 },
              { title: 'Sesi 2', session_name: 'HTML & CSS Deep Dive', session_start_time: '09:00', session_end_time: '12:00', daysOffset: 111 },
              { title: 'Sesi 3', session_name: 'JavaScript ES6+', session_start_time: '09:00', session_end_time: '12:00', daysOffset: 118 },
              { title: 'Sesi 4', session_name: 'Vue 3 & Composition API', session_start_time: '09:00', session_end_time: '12:00', daysOffset: 125 },
              { title: 'Sesi 5', session_name: 'Node.js & REST API', session_start_time: '09:00', session_end_time: '12:00', daysOffset: 132 },
              { title: 'Sesi 6', session_name: 'Database dengan MongoDB', session_start_time: '09:00', session_end_time: '12:00', daysOffset: 139 },
              { title: 'Sesi 7', session_name: 'Authentication & Security', session_start_time: '09:00', session_end_time: '12:00', daysOffset: 146 },
              { title: 'Sesi 8', session_name: 'Final Project & Demo Day', session_start_time: '09:00', session_end_time: '14:00', daysOffset: 153 },
            ],
          },
        ],
      },
      {
        package: {
          title: 'Bootcamp Mobile Development (React Native)',
          description:
            'Kuasai React Native dan bangun aplikasi mobile untuk iOS dan Android dalam 10 minggu. Dari setup environment hingga publish ke App Store dan Play Store dengan bimbingan mentor industri.',
          image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
          status: 'open' as const,
          mentors: [
            { userId: budi._id, occupation: 'Mobile Engineer @ Traveloka' },
            { userId: rina._id, occupation: 'iOS Developer @ Shopee' },
          ],
        },
        batches: [
          {
            title: 'Batch 3',
            sub_title: 'Februari 2025',
            description: 'Kelas weekend — Sabtu pukul 13:00–16:00 selama 10 minggu.',
            started_at: daysFromNow(30),
            ended_at: daysFromNow(100),
            quota_used_percentage: 55,
            price: 4500000,
            strikethrough_price: 6000000,
            package_type: 'online' as const,
            sessions: [
              { title: 'Sesi 1', session_name: 'Setup React Native & Expo', session_start_time: '13:00', session_end_time: '16:00', daysOffset: 30 },
              { title: 'Sesi 2', session_name: 'Component & Navigation', session_start_time: '13:00', session_end_time: '16:00', daysOffset: 37 },
              { title: 'Sesi 3', session_name: 'State Management & API', session_start_time: '13:00', session_end_time: '16:00', daysOffset: 44 },
              { title: 'Sesi 4', session_name: 'Push Notification & Camera', session_start_time: '13:00', session_end_time: '16:00', daysOffset: 51 },
              { title: 'Sesi 5', session_name: 'Publish ke App Store & Play Store', session_start_time: '13:00', session_end_time: '16:00', daysOffset: 58 },
            ],
          },
          {
            title: 'Batch 4',
            sub_title: 'Mei 2025',
            description: 'Batch berikutnya — kuota terbatas 25 peserta.',
            started_at: daysFromNow(120),
            ended_at: daysFromNow(190),
            quota_used_percentage: 0,
            price: 4500000,
            strikethrough_price: 0,
            package_type: 'online' as const,
            sessions: [
              { title: 'Sesi 1', session_name: 'Setup React Native & Expo', session_start_time: '13:00', session_end_time: '16:00', daysOffset: 120 },
              { title: 'Sesi 2', session_name: 'Component & Navigation', session_start_time: '13:00', session_end_time: '16:00', daysOffset: 127 },
              { title: 'Sesi 3', session_name: 'State Management & API', session_start_time: '13:00', session_end_time: '16:00', daysOffset: 134 },
              { title: 'Sesi 4', session_name: 'Push Notification & Camera', session_start_time: '13:00', session_end_time: '16:00', daysOffset: 141 },
              { title: 'Sesi 5', session_name: 'Publish ke App Store & Play Store', session_start_time: '13:00', session_end_time: '16:00', daysOffset: 148 },
            ],
          },
        ],
      },
      {
        package: {
          title: 'Bootcamp Data Science & Machine Learning',
          description:
            'Program 12 minggu dari nol hingga bisa menganalisis data dan membangun model machine learning. Menggunakan Python, Pandas, Scikit-learn, dan TensorFlow. Cocok untuk fresh graduate dan career switcher.',
          image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          status: 'coming_soon' as const,
          mentors: [
            { userId: dian._id, occupation: 'Data Scientist @ Bukalapak' },
          ],
        },
        batches: [
          {
            title: 'Batch 1',
            sub_title: 'Juni 2025 — Early Bird',
            description: 'Batch perdana dengan harga spesial early bird. Daftar sekarang dan hemat 40%.',
            started_at: daysFromNow(180),
            ended_at: daysFromNow(264),
            quota_used_percentage: 10,
            price: 6000000,
            strikethrough_price: 10000000,
            package_type: 'online' as const,
            sessions: [
              { title: 'Sesi 1', session_name: 'Python untuk Data Science', session_start_time: '10:00', session_end_time: '13:00', daysOffset: 180 },
              { title: 'Sesi 2', session_name: 'Exploratory Data Analysis', session_start_time: '10:00', session_end_time: '13:00', daysOffset: 187 },
              { title: 'Sesi 3', session_name: 'Machine Learning Fundamentals', session_start_time: '10:00', session_end_time: '13:00', daysOffset: 194 },
              { title: 'Sesi 4', session_name: 'Deep Learning & Neural Network', session_start_time: '10:00', session_end_time: '13:00', daysOffset: 201 },
              { title: 'Sesi 5', session_name: 'Capstone Project', session_start_time: '10:00', session_end_time: '14:00', daysOffset: 208 },
            ],
          },
        ],
      },
    ];

    let totalPackages = 0, totalBatches = 0, totalSessions = 0;

    for (const data of seedData) {
      const pkg = await BootcampPackage.create(data.package);
      totalPackages++;

      for (const batchData of data.batches) {
        const { sessions: sessionData, ...batchFields } = batchData;
        const batch = await BootcampBatch.create({ ...batchFields, packageId: pkg._id });
        totalBatches++;

        for (const s of sessionData) {
          await BootcampSession.create({
            batchId: batch._id,
            title: s.title,
            session_name: s.session_name,
            session_date: daysFromNow(s.daysOffset),
            session_start_time: s.session_start_time,
            session_end_time: s.session_end_time,
          });
          totalSessions++;
        }
      }
    }

    console.log(`Seeded ${totalPackages} packages, ${totalBatches} batches, ${totalSessions} sessions`);
    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
