import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { env } from './env.config';
import logger from '@/utils/logger';

dotenv.config();

const MONGO_URI = env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.info('MongoDB disconnected');
    });
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};
