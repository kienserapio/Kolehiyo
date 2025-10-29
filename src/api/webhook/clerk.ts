import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/clerk-sdk-node'; 
import { Request, Response } from 'express';
import { handleUserCreation, handleUserUpdate, handleUserDeletion } from '../../services/userServices'; 

export const clerkWebhookHandler = async (req: Request, res: Response) => {
    const svix_id = req.header('svix-id');
    const svix_timestamp = req.header('svix-timestamp');
    const svix_signature = req.header('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).send('Error: Missing Svix headers');
    }

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error('CLERK_WEBHOOK_SECRET is not set in environment variables.');
        return res.status(500).send('Error: Server configuration error');
    }

    const body = req.body.toString(); 
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err: any) {
        console.error('Error verifying webhook:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const eventType = evt.type;

    try {
        switch (eventType) {
            case 'user.created':
                await handleUserCreation(evt.data); 
                break;

            case 'user.updated':
                await handleUserUpdate(evt.data);
                break;

            case 'user.deleted':
                if (evt.data.id) {
                    await handleUserDeletion(evt.data.id);
                }
                break;

            default:
                console.log(`Warning: Unhandled Clerk event type: ${eventType}`);
                break;
        }
    } catch (dbError) {
        console.error(`Database operation failed for event ${eventType}:`, dbError);
        return res.status(500).json({ success: false, message: 'Internal Database Error' });
    }

    return res.status(200).json({ success: true, message: 'Webhook received and processed.' });
};