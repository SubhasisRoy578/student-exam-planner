import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { progressUpdateSchema } from '../validators/dataValidators.js';
import { getProgress, updateProgress } from '../controllers/progressController.js';

const router = Router();

router.use(requireAuth);
router.get('/', getProgress);
router.put('/:subject', validateBody(progressUpdateSchema), updateProgress);

export default router;