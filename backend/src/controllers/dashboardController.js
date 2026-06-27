// Dashboard controller. Aggregates plan, progress, upcoming mocks,
// streak, and days_until_exam into a single response for the
// frontend's main dashboard view.

import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { computeStreak } from './achievementController.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const now = new Date();

  const [plan, progress, upcomingMocks, achievementDates] = await Promise.all([
    prisma.studentPlan.findFirst({ where: { userId } }),
    prisma.progress.findMany({ where: { userId } }),
    prisma.mockInterview.findMany({
      where: { userId, scheduledDate: { gte: now } },
      orderBy: { scheduledDate: 'asc' },
      take: 5,
    }),
    prisma.achievement.findMany({ where: { userId }, select: { date: true } }),
  ]);

  const daysUntilExam = plan
    ? Math.max(0, Math.ceil((new Date(plan.examDate) - now) / (1000 * 60 * 60 * 24)))
    : null;

  const streak = computeStreak(achievementDates.map((a) => a.date));

  res.json({
    plan: plan
      ? {
          exam_date: plan.examDate,
          goal: plan.goal,
          weak_subjects: plan.weakSubjects,
          daily_hours: plan.dailyHours,
        }
      : null,
    progress: progress.map((p) => ({
      subject_name: p.subjectName,
      mastery_percentage: p.masteryPercentage,
      completed_tasks: p.completedTasks,
    })),
    upcoming_mocks: upcomingMocks.map((m) => ({
      id: m.id,
      scheduled_date: m.scheduledDate,
      feedback: m.feedback,
      score: m.score,
    })),
    streak,
    days_until_exam: daysUntilExam,
  });
});