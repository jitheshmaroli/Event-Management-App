import { config } from 'dotenv';
import express from 'express';
import authRoutes from '@/routes/auth.routes';
import { env } from '@/config/env.config';
import { connectDB } from '@/config/index';
import { errorHandler } from '@/middlewares/errorHandler';
import logger from '@/utils/logger';
import cookieParser from 'cookie-parser';

config();

const app = express();
const PORT = env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
