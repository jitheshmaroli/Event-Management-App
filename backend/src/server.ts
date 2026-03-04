import { config } from 'dotenv';
import express from 'express';
import authRoutes from '@/routes/auth.routes';
import serviceRoutes from '@/routes/service.routes';
import bookingRoutes from '@/routes/booking.routes';
import adminRoutes from '@/routes/admin.routes';
import userRoutes from '@/routes/user.routes';
import { env } from '@/config/env.config';
import { connectDB } from '@/config/index';
import { errorHandler } from '@/middlewares/errorHandler';
import logger from '@/utils/logger';
import cookieParser from 'cookie-parser';
import cors from 'cors';

config();

const app = express();
const PORT = env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

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
