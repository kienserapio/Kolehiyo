import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  const safeErr = err as any;
  // Centralized logging hook - adapt to Sentry / Datadog here
  console.error('[errorHandler]', safeErr?.message ?? safeErr, { stack: safeErr?.stack });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message, details: err.details });
  }

  return res.status(500).json({ error: 'Internal server error' });
};

export default errorHandler;
