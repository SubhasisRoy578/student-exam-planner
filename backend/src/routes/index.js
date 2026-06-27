import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import planRoutes from './planRoutes.js';
import progressRoutes from './progressRoutes.js';
import mockInterviewRoutes from './mockInterviewRoutes.js';
import achievementRoutes from './achievementRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import guestSyncRoutes from './guestSyncRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/plan', planRoutes);
router.use('/progress', progressRoutes);
router.use('/mock-interviews', mockInterviewRoutes);
router.use('/achievements', achievementRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/guest-sync', guestSyncRoutes);

export default router;