// Progress controller. One row per (user, subject); PUT upserts
// since subjects are created implicitly the first time they're touched.

import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function serializeProgress(p) {
  return {
    subject_name: p.subjectName,
    mastery_percentage: p.masteryPercentage,
    completed_tasks: p.completedTasks,
  };
}

export const getProgress = asyncHandler(async (req, res) => {
  const rows = await prisma.progress.findMany({
    where: { userId: req.user.id },
    orderBy: { subjectName: 'asc' },
  });

  res.json({ progress: rows.map(serializeProgress) });
});

export const updateProgress = asyncHandler(async (req, res) => {
  const { subject } = req.params;
  const { mastery_percentage, completed_tasks } = req.body;

  await prisma.progress.upsert({
    where: { userId_subjectName: { userId: req.user.id, subjectName: subject } },
    update: { masteryPercentage: mastery_percentage, completedTasks: completed_tasks },
    create: {
      userId: req.user.id,
      subjectName: subject,
      masteryPercentage: mastery_percentage,
      completedTasks: completed_tasks,
    },
  });

  res.json({ message: 'Progress updated' });
});