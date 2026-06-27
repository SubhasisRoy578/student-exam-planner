// Guest-sync controller. Merges locally-stored guest data into the
// newly authenticated user's account. Runs inside a transaction so a
// partial failure (e.g. one bad progress row) doesn't leave the
// account half-synced.
//
// Merge strategy: guest plan only applies if the user has no plan yet
// (server data wins on conflict, since it's presumably from another
// device/session); guest progress upserts per subject; guest
// achievements are appended as new log entries.

import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const guestSync = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { guest_data } = req.body;

  await prisma.$transaction(async (tx) => {
    const existingPlan = await tx.studentPlan.findFirst({ where: { userId } });

    if (!existingPlan && guest_data.exam_date) {
      await tx.studentPlan.create({
        data: {
          userId,
          examDate: guest_data.exam_date,
          goal: guest_data.goal ?? null,
          weakSubjects: guest_data.weak_subjects ?? [],
          dailyHours: guest_data.daily_hours ?? 0,
        },
      });
    }

    if (guest_data.progress?.length) {
      for (const p of guest_data.progress) {
        await tx.progress.upsert({
          where: { userId_subjectName: { userId, subjectName: p.subject_name } },
          update: {
            masteryPercentage: p.mastery_percentage,
            completedTasks: p.completed_tasks ?? [],
          },
          create: {
            userId,
            subjectName: p.subject_name,
            masteryPercentage: p.mastery_percentage,
            completedTasks: p.completed_tasks ?? [],
          },
        });
      }
    }

    if (guest_data.achievements?.length) {
      await tx.achievement.createMany({
        data: guest_data.achievements.map((a) => ({
          userId,
          logEntry: a.log_entry,
          date: a.date ?? new Date(),
          streakCount: a.streak_count ?? 0,
        })),
      });
    }
  });

  res.json({ message: 'Guest data synced to account' });
});