// Achievements controller. streak_count is computed server-side from
// the user's achievement log dates (consecutive days ending today),
// rather than trusting a client-supplied value, since the streak is
// derived data and the client could otherwise spoof it.

import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function serializeAchievement(a) {
  return {
    log_entry: a.logEntry,
    date: a.date,
    streak_count: a.streakCount,
  };
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Computes the current consecutive-day streak ending today (or
 * yesterday, if today has no entry yet) from a set of achievement dates.
 */
function computeStreak(allDates) {
  const daySet = new Set(allDates.map((d) => startOfDay(d).getTime()));

  let streak = 0;
  let cursor = startOfDay(new Date());

  // If nothing logged today, the streak still counts if yesterday was logged;
  // it just hasn't been broken yet.
  if (!daySet.has(cursor.getTime())) {
    cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
  }

  while (daySet.has(cursor.getTime())) {
    streak += 1;
    cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
  }

  return streak;
}

export const getAchievements = asyncHandler(async (req, res) => {
  const achievements = await prisma.achievement.findMany({
    where: { userId: req.user.id },
    orderBy: { date: 'desc' },
  });

  res.json({ achievements: achievements.map(serializeAchievement) });
});

export const createAchievement = asyncHandler(async (req, res) => {
  const { log_entry } = req.body;

  const existingDates = await prisma.achievement.findMany({
    where: { userId: req.user.id },
    select: { date: true },
  });

  const newStreak = computeStreak([...existingDates.map((d) => d.date), new Date()]);

  const achievement = await prisma.achievement.create({
    data: {
      userId: req.user.id,
      logEntry: log_entry,
      date: new Date(),
      streakCount: newStreak,
    },
  });

  res.status(201).json({ message: 'Achievement added', achievement: serializeAchievement(achievement) });
});

export { computeStreak };