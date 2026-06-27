import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { achievementCreateSchema } from '../validators/dataValidators.js';
import { getAchievements, createAchievement } from '../controllers/achievementController.js';

const router = Router();

router.use(requireAuth);
router.get('/', getAchievements);
router.post('/', validateBody(achievementCreateSchema), createAchievement);

export default router;