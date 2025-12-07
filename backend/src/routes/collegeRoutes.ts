import express from 'express';
import {
  listCollegesHandler,
  collegeDetailsHandler,
  trackedCollegesHandler,
  addCollegeToTrackerHandler,
  removeCollegeFromTrackerHandler,
  updateCollegeChecklistHandler,
} from '../api/colleges/collegeHandlers';
import { wrap } from '../middleware/asyncWrap';
import supabaseAuth from '../middleware/supabaseAuth';
import { validateBody } from '../middleware/validate';
import { addCollegeToTrackerSchema, updateCollegeChecklistSchema } from '../validation/collegeSchemas';

const router = express.Router();

// Public list
router.get('/colleges', wrap(listCollegesHandler));

// Tracked colleges for a user (requires auth)
router.get('/colleges/tracked', supabaseAuth, wrap(trackedCollegesHandler));

// Single college details
router.get('/colleges/:id', wrap(collegeDetailsHandler));



// Add to tracker
router.post('/colleges/tracked', supabaseAuth, validateBody(addCollegeToTrackerSchema), wrap(addCollegeToTrackerHandler));

// Remove from tracker
router.delete('/colleges/tracked', supabaseAuth, wrap(removeCollegeFromTrackerHandler));

// Update checklist (progress)
router.patch('/colleges/tracked/checklist', supabaseAuth, validateBody(updateCollegeChecklistSchema), wrap(updateCollegeChecklistHandler));

export default router;

// Optional helper to mount routes on an Express app
export const registerCollegeRoutes = (app: express.Application, prefix = '/api') => {
  app.use(prefix, router);
};
