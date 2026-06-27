// Mock interviews controller: list, schedule, and add feedback/score.

import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function serializeInterview(i) {
  return {
    id: i.id,
    scheduled_date: i.scheduledDate,
    feedback: i.feedback,
    score: i.score,
  };
}

export const getMockInterviews = asyncHandler(async (req, res) => {
  const interviews = await prisma.mockInterview.findMany({
    where: { userId: req.user.id },
    orderBy: { scheduledDate: 'asc' },
  });

  res.json({ interviews: interviews.map(serializeInterview) });
});

export const createMockInterview = asyncHandler(async (req, res) => {
  const { scheduled_date } = req.body;

  const interview = await prisma.mockInterview.create({
    data: { userId: req.user.id, scheduledDate: scheduled_date },
  });

  res.status(201).json({ message: 'Mock scheduled', interview: serializeInterview(interview) });
});

export const updateMockInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { feedback, score } = req.body;

  // Scope the lookup to the authenticated user so one user can't
  // overwrite another user's interview by guessing an id.
  const existing = await prisma.mockInterview.findFirst({ where: { id, userId: req.user.id } });
  if (!existing) throw new ApiError(404, 'Mock interview not found');

  await prisma.mockInterview.update({
    where: { id },
    data: { feedback, score },
  });

  res.json({ message: 'Feedback added' });
});