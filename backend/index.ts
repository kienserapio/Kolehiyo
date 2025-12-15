import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import logger from './src/middleware/logger';
import corsMiddleware from './src/middleware/cors';
import bodyParser from 'body-parser';
import rawWebhookHandler from './src/api/webhook/webhookHandler';
import healthRouter from './src/api/health';
import scholarshipRoutes, { registerScholarshipRoutes } from './src/routes/scholarshipRoutes';
import collegeRoutes, { registerCollegeRoutes } from './src/routes/collegeRoutes';
import errorHandler from './src/middleware/errorHandler';
import { startCron } from './src/utils/cron';

const app = express();
const PORT = process.env.PORT || 3000;

// logging, CORS and body parsing
app.use(logger);
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => res.send('Kolehiyo backend: OK'));

// health endpoints (mounted from router)
app.use('/', healthRouter);

// Raw webhook endpoint (signature verification should run here)
// Uses bodyParser.raw to preserve the raw body for signature checks
app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), rawWebhookHandler as any);

// Register API routes
registerScholarshipRoutes(app, '/api');
registerCollegeRoutes(app, '/api');

// Global error handler (must be after routes)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    
    // Start cron job to keep Render server alive
    startCron();
});

export default app;
