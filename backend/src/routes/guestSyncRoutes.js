import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { guestSyncSchema } from '../validators/dataValidators.js';
import { guestSync } from '../controllers/guestSyncController.js';

const router = Router();

router.post('/', requireAuth, validateBody(guestSyncSchema), guestSync);

export default router;