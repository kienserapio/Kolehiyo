import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { clerkWebhookHandler } from './src/api/webhook/clerk'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl === '/api/webhook/clerk') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

app.post(
    '/api/webhook/clerk',
    bodyParser.raw({ type: 'application/json' }),
    clerkWebhookHandler
);

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Kolehiyo Backend is running.');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
