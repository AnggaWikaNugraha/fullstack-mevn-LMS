import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const mentors = [
  {
    name: 'Andi Pratama',
    email: 'andi.pratama@mentor.com',
    password: '12345678',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    role: 'mentor' as const,
    isVerified: true,
  },
  {
    name: 'Sari Dewi',
    email: 'sari.dewi@mentor.com',
    password: '12345678',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    role: 'mentor' as const,
    isVerified: true,
  },
  {
    name: 'Budi Santoso',
    email: 'budi.santoso@mentor.com',
    password: '12345678',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    role: 'mentor' as const,
    isVerified: true,
  },
  {
    name: 'Rina Kusuma',
    email: 'rina.kusuma@mentor.com',
    password: '12345678',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    role: 'mentor' as const,
    isVerified: true,
  },
  {
    name: 'Dian Purnama',
    email: 'dian.purnama@mentor.com',
    password: '12345678',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    role: 'mentor' as const,
    isVerified: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Upsert per email — idempotent, tidak hapus data lain
    for (const m of mentors) {
      await User.findOneAndUpdate(
        { email: m.email },
        { $setOnInsert: m },
        { upsert: true, new: true }
      );
    }

    console.log(`Seeded ${mentors.length} mentors`);
    mentors.forEach((m) => console.log(`  - ${m.name} <${m.email}>`));

    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
