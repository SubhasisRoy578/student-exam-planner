import { z } from 'zod';

// Schema for creating a mock interview
export const mockInterviewCreateSchema = z.object({
  scheduledDate: z.string().datetime({ message: 'Invalid date format' }),
  feedback: z.string().optional(),
  score: z.number().min(0).max(100).optional()
});

// Schema for updating a mock interview
export const mockInterviewUpdateSchema = z.object({
  scheduledDate: z.string().datetime({ message: 'Invalid date format' }).optional(),
  feedback: z.string().optional(),
  score: z.number().min(0).max(100).optional()
});

// Schema for registering a user
export const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

// Schema for login
export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' })
});

// Schema for email verification
export const verifyEmailSchema = z.object({
  token: z.string().min(1, { message: 'Verification token is required' })
});

// Schema for forgot password
export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' })
});

// Schema for reset password
export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Reset token is required' }),
  newPassword: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

// Schema for creating a study plan
export const planCreateSchema = z.object({
  examDate: z.string().datetime({ message: 'Invalid date format' }),
  goal: z.string().optional(),
  weakSubjects: z.array(z.string()).default([]),
  dailyHours: z.number().min(1).max(12).default(4)
});

// Schema for updating a study plan
export const planUpdateSchema = z.object({
  examDate: z.string().datetime({ message: 'Invalid date format' }).optional(),
  goal: z.string().optional(),
  weakSubjects: z.array(z.string()).optional(),
  dailyHours: z.number().min(1).max(12).optional()
});

// Schema for progress update
export const progressUpdateSchema = z.object({
  masteryPercentage: z.number().min(0).max(100),
  completedTasks: z.array(z.string()).optional()
});

// Schema for achievement creation
export const achievementCreateSchema = z.object({
  logEntry: z.string().min(1, { message: 'Achievement entry is required' })
});

// Schema for guest sync
export const guestSyncSchema = z.object({
  examDate: z.string().datetime({ message: 'Invalid date format' }).optional(),
  goal: z.string().optional(),
  weakSubjects: z.array(z.string()).optional(),
  dailyHours: z.number().min(1).max(12).optional(),
  progress: z.array(z.object({
    subjectName: z.string(),
    masteryPercentage: z.number().min(0).max(100),
    completedTasks: z.array(z.string()).optional()
  })).optional(),
  achievements: z.array(z.object({
    logEntry: z.string(),
    date: z.string().datetime().optional()
  })).optional()
});
