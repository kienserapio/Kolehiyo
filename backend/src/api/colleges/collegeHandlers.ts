import { Request, Response } from 'express';
import {
  getPublicCollegeList,
  getPublicCollegeDetails,
  getTrackedColleges,
  addCollegeToTracker,
  removeCollegeFromTracker,
  updateTrackerChecklist,
} from '../../services/collegeServices';

import { AppError } from '../../utils/error';

// Handler: GET /api/colleges
export const listCollegesHandler = async (req: Request, res: Response) => {
  try {
    const list = await getPublicCollegeList();
    return res.status(200).json({ data: list });
  } catch (err: any) {
    console.error('listCollegesHandler error:', err?.message ?? err);
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message, details: err.details });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Handler: GET /api/colleges/:id
export const collegeDetailsHandler = async (req: Request, res: Response) => {
  const id = req.params.id ?? req.query.id;
  if (!id) return res.status(400).json({ error: 'college id is required' });

  try {
    const details = await getPublicCollegeDetails(String(id));
    return res.status(200).json({ data: details });
  } catch (err: any) {
    console.error('collegeDetailsHandler error:', err?.message ?? err);
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message, details: err.details });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Handler: GET /api/colleges/tracked?userId=...
export const trackedCollegesHandler = async (req: Request, res: Response) => {
  const userId = String((req as any).userId ?? req.query.userId ?? req.body.userId ?? '');
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const tracked = await getTrackedColleges(userId);
    return res.status(200).json({ data: tracked });
  } catch (err: any) {
    console.error('trackedCollegesHandler error:', err?.message ?? err);
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message, details: err.details });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Handler: POST /api/colleges/tracked  { userId, collegeId }
export const addCollegeToTrackerHandler = async (req: Request, res: Response) => {
  const userIdFromReq = (req as any).userId as string | undefined;
  const collegeId = req.body.collegeId as string | undefined;
  const userId = String(userIdFromReq ?? req.body.userId ?? '');
  if (!userId || !collegeId) return res.status(400).json({ error: 'userId and collegeId are required' });

  console.log("Incoming body:", req.body);
  console.log("User ID from token:", (req as any).userId);

  try {
    console.log("Inserting collegeId:", collegeId, "for user:", userId);
    const created = await addCollegeToTracker(String(userId), String(collegeId));
    console.log("Inserting collegeId:", collegeId, "for user:", userId);
    return res.status(201).json({ data: created });
  } catch (err: any) {
    console.error("addCollegeToTrackerHandler error:", err);

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message, details: err.details });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Handler: DELETE /api/colleges/tracked  body: { userId, collegeId }
export const removeCollegeFromTrackerHandler = async (req: Request, res: Response) => {
  const userIdFromReq = (req as any).userId as string | undefined;
  const collegeId = req.body.collegeId as string | undefined;
  const userId = String(userIdFromReq ?? req.body.userId ?? '');
  if (!userId || !collegeId) return res.status(400).json({ error: 'userId and collegeId are required' });

  try {
    const deleted = await removeCollegeFromTracker(String(userId), String(collegeId));
    return res.status(200).json({ data: deleted });
  } catch (err: any) {
    console.error('removeCollegeFromTrackerHandler error:', err?.message ?? err);
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message, details: err.details });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Handler: PATCH /api/colleges/tracked/checklist  body: { trackerId, checklist }
export const updateCollegeChecklistHandler = async (req: Request, res: Response) => {
  const { trackerId, checklist } = req.body;
  console.log("Received checklist update:", req.body);

  if (!trackerId || !Array.isArray(checklist)) {
    console.log("Invalid request body:", req.body);
    return res.status(400).json({ error: 'trackerId and checklist array are required' });
  }

  try {
    console.log("Updating checklist for trackerId:", trackerId, "with checklist:", checklist);
    const updated = await updateTrackerChecklist(Number(trackerId), checklist);
    console.log("Updated checklist for trackerId:", trackerId, " result:", updated);
    return res.status(200).json({ data: updated });
  } catch (err: any) {
    console.error('updateCollegeChecklistHandler error:', err?.message ?? err);
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message, details: err.details });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  listCollegesHandler,
  collegeDetailsHandler,
  trackedCollegesHandler,
  addCollegeToTrackerHandler,
  removeCollegeFromTrackerHandler,
  updateCollegeChecklistHandler,
};
