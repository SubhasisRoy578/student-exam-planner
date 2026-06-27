import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, createdAt: true },
  });

  if (!user) throw new ApiError(404, 'User not found');

  res.json({ user: { id: user.id, email: user.email, created_at: user.createdAt } });
});