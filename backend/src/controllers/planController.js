// Plan controller. A user has at most one active StudentPlan;
// POST creates it, PUT updates it (creating it if it doesn't exist yet,
// since the frontend may call PUT directly on first save).

import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function serializePlan(plan) {
  return {
    exam_date: plan.examDate,
    goal: plan.goal,
    weak_subjects: plan.weakSubjects,
    daily_hours: plan.dailyHours,
  };
}

export const getPlan = asyncHandler(async (req, res) => {
  const plan = await prisma.studentPlan.findFirst({ where: { userId: req.user.id } });

  if (!plan) throw new ApiError(404, 'No plan found for this user');

  res.json(serializePlan(plan));
});

export const createPlan = asyncHandler(async (req, res) => {
  const { exam_date, goal, weak_subjects, daily_hours } = req.body;

  const existing = await prisma.studentPlan.findFirst({ where: { userId: req.user.id } });
  if (existing) {
    throw new ApiError(409, 'A plan already exists for this user. Use PUT /api/plan to update it.');
  }

  const plan = await prisma.studentPlan.create({
    data: {
      userId: req.user.id,
      examDate: exam_date,
      goal,
      weakSubjects: weak_subjects,
      dailyHours: daily_hours,
    },
  });

  res.status(201).json({ message: 'Plan saved', plan: serializePlan(plan) });
});

export const updatePlan = asyncHandler(async (req, res) => {
  const { exam_date, goal, weak_subjects, daily_hours } = req.body;

  const existing = await prisma.studentPlan.findFirst({ where: { userId: req.user.id } });

  const data = {
    examDate: exam_date,
    goal,
    weakSubjects: weak_subjects,
    dailyHours: daily_hours,
  };

  const plan = existing
    ? await prisma.studentPlan.update({ where: { id: existing.id }, data })
    : await prisma.studentPlan.create({ data: { userId: req.user.id, ...data } });

  res.json({ message: 'Plan updated', plan: serializePlan(plan) });
});