import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../utils/supabase';
import { AppError } from '../utils/error';

export default async function supabaseAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new AppError('Missing Authorization header', 401);

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') throw new AppError('Invalid Authorization header', 401);

    const token = parts[1];

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) {
      throw new AppError('Invalid or expired token', 401, error?.message);
    }

    // attach user to request for handlers/services
    (req as any).user = data.user;
    (req as any).userId = data.user.id;
    next();
  } catch (err) {
    next(err);
  }
}
