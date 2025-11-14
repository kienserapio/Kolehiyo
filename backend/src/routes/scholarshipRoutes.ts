import express from 'express';
import {
  listScholarshipsHandler,
  scholarshipDetailsHandler,
  trackedScholarshipsHandler,
  addScholarshipToTrackerHandler,
  removeScholarshipFromTrackerHandler,
  updateScholarshipChecklistHandler,
} from '../api/scholarship/scholarshipHandler';
import { wrap } from '../middleware/asyncWrap';
import supabaseAuth from '../middleware/supabaseAuth';
import { validateBody } from '../middleware/validate';
import { addScholarshipToTrackerSchema, updateScholarshipChecklistSchema } from '../validation/scholarshipSchemas';

const router = express.Router();

// Public list
router.get('/scholarships', wrap(listScholarshipsHandler));

// Tracked scholarships for a user (requires auth)
router.get('/scholarships/tracked', supabaseAuth, wrap(trackedScholarshipsHandler));

// Single scholarship details
router.get('/scholarships/:id', wrap(scholarshipDetailsHandler));



// Add to tracker
router.post('/scholarships/tracked', supabaseAuth, validateBody(addScholarshipToTrackerSchema), wrap(addScholarshipToTrackerHandler));

// Remove from tracker
router.delete('/scholarships/tracked', supabaseAuth, wrap(removeScholarshipFromTrackerHandler));

// Update checklist (progress)
router.patch('/scholarships/tracked/checklist', supabaseAuth, validateBody(updateScholarshipChecklistSchema), wrap(updateScholarshipChecklistHandler));

export default router;

// Optional helper to mount routes on an Express app
export const registerScholarshipRoutes = (app: express.Application, prefix = '/api') => {
  app.use(prefix, router);
};
