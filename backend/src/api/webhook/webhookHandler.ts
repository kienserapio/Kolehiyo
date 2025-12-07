import { Request, Response, NextFunction } from 'express';

export const rawWebhookHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const raw = req.body as Buffer | string | undefined;
    if (!raw) return res.status(400).send('Missing raw body');

    // signature headers commonly used by providers
    const signature = (req.headers['x-signature'] ?? req.headers['stripe-signature'] ?? req.headers['x-clerk-signature']) as string | undefined;

    // If you need to verify a signature, do it here using the raw Buffer
    // e.g. verifyHmac(raw, signature, secret)

    let parsed: unknown;
    try {
      const rawString = Buffer.isBuffer(raw) ? raw.toString('utf8') : String(raw);
      parsed = JSON.parse(rawString);
    } catch (e) {
      // Not JSON — still allow handlers to inspect raw body
      parsed = undefined;
    }

    // Attach to req for downstream middleware if needed
    (req as any).webhook = { raw, parsed, signature, headers: req.headers };

    // For now, just acknowledge receipt
    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
};

export default rawWebhookHandler;
