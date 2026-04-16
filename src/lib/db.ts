import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dar-ali';

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit process in serverless environments
  }
};
