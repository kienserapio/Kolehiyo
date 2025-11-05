import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../utils/supabase';

const router = Router();

// Liveness - very fast, no external IO
router.get('/healthz', (_req: Request, res: Response) => res.sendStatus(200));

// Readiness - check essential env and a cheap DB probe
router.get('/ready', async (_req: Request, res: Response) => {
  // Basic env checks
  const missing: string[] = [];
  if (!process.env.SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');

  if (missing.length) {
    return res.status(500).json({ ok: false, reason: 'missing_env', missing });
  }

  try {
    // cheap probe: select 1 row from a small table
    const { error } = await supabaseAdmin.from('college').select('id').limit(1).maybeSingle();
    if (error) throw error;
    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('readiness check failed', err?.message ?? err);
    return res.status(500).json({ ok: false, reason: 'db_error', details: err?.message ?? String(err) });
  }
});

export default router;
