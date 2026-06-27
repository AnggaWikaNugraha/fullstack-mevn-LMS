import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI as string;

  await mongoose.connect(uri);

  const { host, port, name } = mongoose.connection;
  console.log(`MongoDB connected`);
  console.log(`  Host : ${host}`);
  console.log(`  Port : ${port || 'default (Atlas)'}`);
  console.log(`  DB   : ${name}`);
};

// Log setiap kali koneksi terputus
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

// Log kalau ada error setelah koneksi awal
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err.message);
});

export default connectDB;
