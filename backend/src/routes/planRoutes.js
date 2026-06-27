import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { planSchema } from '../validators/dataValidators.js';
import { getPlan, createPlan, updatePlan } from '../controllers/planController.js';

const router = Router();

router.use(requireAuth);
router.get('/', getPlan);
router.post('/', validateBody(planSchema), createPlan);
router.put('/', validateBody(planSchema), updatePlan);

export default router;