import morgan from 'morgan';
import { RequestHandler } from 'express';

// Choose format via env, default to 'dev' for development readability
const format = process.env.LOGGER_FORMAT ?? (process.env.NODE_ENV === 'production' ? 'combined' : 'dev');

// Simple stream that writes to console (could be swapped to winston/pino)
const stream = {
  write: (message: string) => {
    // morgan already includes newline
    // You can enrich logs here (request id, user info, etc.)
    // For now, log to stdout
    // eslint-disable-next-line no-console
    console.log(message.trim());
  },
};

export const logger: RequestHandler = morgan(format, { stream });

export default logger;
