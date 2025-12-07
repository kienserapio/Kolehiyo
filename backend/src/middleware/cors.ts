import cors from 'cors';
import { RequestHandler } from 'express';

// Build a CORS middleware using env configuration.
// FRONTEND_ORIGIN can be a single origin or a comma-separated list of origins.
const raw = process.env.FRONTEND_ORIGIN ?? '';
const origins = raw.split(',').map(s => s.trim()).filter(Boolean);

const options: any = {
  origin: origins.length ? origins : true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

const corsMiddleware: RequestHandler = cors(options as any);

export default corsMiddleware;
