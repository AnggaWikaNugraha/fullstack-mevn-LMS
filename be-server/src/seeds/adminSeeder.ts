import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    const email = 'admin@gmail.com';

    await User.deleteOne({ email });

    // Password di-hash otomatis oleh pre-save hook di User model
    await User.create({
      name: 'Admin',
      email,
      password: '123123123',
      role: 'admin',
      isVerified: true,
    });

    console.log(`Admin seeded: ${email}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
