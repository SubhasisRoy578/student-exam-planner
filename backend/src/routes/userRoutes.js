import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getProfile } from '../controllers/userController.js';

const router = Router();

router.use(requireAuth);
router.get('/profile', getProfile);

export default router;