/**
 * Standardized MNC Response Envelope & Error Handlers
 */
import { Request, Response, NextFunction } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    durationMs?: number;
  };
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200) {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString()
    }
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  code = 'INTERNAL_ERROR',
  details?: any
) {
  const payload: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  };
  return res.status(statusCode).json(payload);
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  console.error('[Marketplace Error]', err);
  const status = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred in the marketplace platform.';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  return sendError(res, message, status, code, process.env.NODE_ENV === 'development' ? err.stack : undefined);
}
