// Zod schemas for the student data endpoints (plan, progress,
// mock interviews, achievements, guest sync).

import { z } from 'zod';

export const planSchema = z.object({
  exam_date: z.coerce.date({ errorMap: () => ({ message: 'exam_date must be a valid date' }) }),
  goal: z.string().max(2000).optional().nullable(),
  weak_subjects: z.array(z.string()).default([]),
  daily_hours: z.number().min(0).max(24),
});

export const progressUpdateSchema = z.object({
  mastery_percentage: z.number().min(0).max(100),
  completed_tasks: z.array(z.string()).default([]),
});

export const mockInterviewCreateSchema = z.object({
  scheduled_date: z.coerce.date({ errorMap: () => ({ message: 'scheduled_date must be a valid date' }) }),
});

export const mockInterviewUpdateSchema = z.object({
  feedback: z.string().max(5000).optional().nullable(),
  score: z.number().min(0).max(100).optional().nullable(),
});

export const achievementCreateSchema = z.object({
  log_entry: z.string().min(1, 'log_entry is required').max(1000),
});

export const guestSyncSchema = z.object({
  guest_data: z.object({
    exam_date: z.coerce.date().optional(),
    goal: z.string().max(2000).optional().nullable(),
    weak_subjects: z.array(z.string()).optional(),
    daily_hours: z.number().min(0).max(24).optional(),
    progress: z
      .array(
        z.object({
          subject_name: z.string(),
          mastery_percentage: z.number().min(0).max(100),
          completed_tasks: z.array(z.string()).default([]),
        })
      )
      .optional(),
    achievements: z
      .array(
        z.object({
          log_entry: z.string(),
          date: z.coerce.date().optional(),
          streak_count: z.number().int().min(0).optional(),
        })
      )
      .optional(),
  }),
});