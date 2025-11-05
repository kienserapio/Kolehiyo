import { Request, Response } from 'express';
import {
  getPublicScholarshipList,
  getPublicScholarshipDetails,
  getTrackedScholarships,
  addScholarshipToTracker,
  removeScholarshipFromTracker,
  updateScholarshipTrackerChecklist,
} from '../../services/scholarshipServices';

import { AppError } from '../../utils/error';     

// Handler: GET /api/scholarships
export const listScholarshipsHandler = async (req: Request, res: Response) => {
  try {
    const list = await getPublicScholarshipList();
    return res.status(200).json({ data: list });
  } catch (err: any) {
    console.error('listScholarshipsHandler error:', err?.message ?? err);
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message, details: err.details });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Handler: GET /api/scholarships/:id
export const scholarshipDetailsHandler = async (req: Request, res: Response) => {
  const id = req.params.id ?? req.query.id;
  if (!id) return res.status(400).json({ error: 'scholarship id is required' });

  try {
    const details = await getPublicScholarshipDetails(String(id));
    return res.status(200).json({ data: details });
  } catch (err: any) {
    console.error('scholarshipDetailsHandler error:', err?.message ?? err);
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message, details: err.details });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Handler: GET /api/scholarships/tracked?userId=...
export const trackedScholarshipsHandler = async (req: Request, res: Response) => {
  const userId = String((req as any).userId ?? req.query.userId ?? req.body.userId ?? '');
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const tracked = await getTrackedScholarships(userId);
    return res.status(200).json({ data: tracked });
  } catch (err: any) {
    console.error('trackedScholarshipsHandler error:', err?.message ?? err);
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message, details: err.details });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Handler: POST /api/scholarships/tracked  { userId, scholarshipId }
export const addScholarshipToTrackerHandler = async (req: Request, res: Response) => {
  const userIdFromReq = (req as any).userId as string | undefined;
  const scholarshipId = req.body.scholarshipId as string | undefined;
  const userId = String(userIdFromReq ?? req.body.userId ?? '');
  if (!userId || !scholarshipId) return res.status(400).json({ error: 'userId and scholarshipId are required' });

  try {
    const created = await addScholarshipToTracker(String(userId), String(scholarshipId));
    return res.status(201).json({ data: created });
  } catch (err: any) {
    console.error('addScholarshipToTrackerHandler error:', err?.message ?? err);
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message, details: err.details });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Handler: DELETE /api/scholarships/tracked  body: { userId, scholarshipId }
export const removeScholarshipFromTrackerHandler = async (req: Request, res: Response) => {
  const userIdFromReq = (req as any).userId as string | undefined;
  const scholarshipId = req.body.scholarshipId as string | undefined;
  const userId = String(userIdFromReq ?? req.body.userId ?? '');
  if (!userId || !scholarshipId) return res.status(400).json({ error: 'userId and scholarshipId are required' });

  try {
    const deleted = await removeScholarshipFromTracker(String(userId), String(scholarshipId));
    return res.status(200).json({ data: deleted });
  } catch (err: any) {
    console.error('removeScholarshipFromTrackerHandler error:', err?.message ?? err);
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message, details: err.details });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Handler: PATCH /api/scholarships/tracked/checklist  body: { trackerId, checklist }
export const updateScholarshipChecklistHandler = async (req: Request, res: Response) => {
  const { trackerId, checklist } = req.body;
  if (!trackerId || !Array.isArray(checklist)) return res.status(400).json({ error: 'trackerId and checklist array are required' });

  try {
    const updated = await updateScholarshipTrackerChecklist(Number(trackerId), checklist);
    return res.status(200).json({ data: updated });
  } catch (err: any) {
    console.error('updateScholarshipChecklistHandler error:', err?.message ?? err);
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message, details: err.details });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  listScholarshipsHandler,
  scholarshipDetailsHandler,
  trackedScholarshipsHandler,
  addScholarshipToTrackerHandler,
  removeScholarshipFromTrackerHandler,
  updateScholarshipChecklistHandler,
};
