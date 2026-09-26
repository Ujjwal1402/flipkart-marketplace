/**
 * Express Application Configuration
 * MNC Tier Backend Setup
 */
import express from 'express';
import { apiRouter } from './routes/apiRoutes';
import { requestLogger } from './middlewares/loggerMiddleware';
import { errorHandler } from './middlewares/errorHandler';

export function createBackendApp() {
  const app = express();

  // Standard middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // Mount API Router under /api
  app.use('/api', apiRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
