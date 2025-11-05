import { z } from 'zod';

export const addScholarshipToTrackerSchema = z.object({
  scholarshipId: z.string().min(1, 'scholarshipId is required'),
});

export const updateScholarshipChecklistSchema = z.object({
  trackerId: z.number().int().positive(),
  checklist: z.array(z.any()),
});

export const scholarshipIdParamSchema = z.object({ id: z.string().min(1) });

export type AddScholarshipToTracker = z.infer<typeof addScholarshipToTrackerSchema>;
export type UpdateScholarshipChecklist = z.infer<typeof updateScholarshipChecklistSchema>;
