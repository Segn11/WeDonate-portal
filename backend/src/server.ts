import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { globalErrorHandler } from './middlewares/error.middleware';

dotenv.config();

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health Check Endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'UP',
      system: 'Adama Support Portal Backend API',
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use('/api/v1', apiRouter);

  // Global Error Handler
  app.use(globalErrorHandler);

  return app;
};
