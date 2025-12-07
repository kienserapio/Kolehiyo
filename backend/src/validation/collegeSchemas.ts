import { z } from 'zod';

export const addCollegeToTrackerSchema = z.object({
  collegeId: z.string().min(1, 'collegeId is required'),
});

export const updateCollegeChecklistSchema = z.object({
  trackerId: z.number().int().positive(),
  checklist: z.array(z.any()),
});

export const collegeIdParamSchema = z.object({ id: z.string().min(1) });

export type AddCollegeToTracker = z.infer<typeof addCollegeToTrackerSchema>;
export type UpdateCollegeChecklist = z.infer<typeof updateCollegeChecklistSchema>;
