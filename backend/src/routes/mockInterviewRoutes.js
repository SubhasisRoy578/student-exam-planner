import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { mockInterviewCreateSchema, mockInterviewUpdateSchema } from '../validators/dataValidators.js';
import {
  getMockInterviews,
  createMockInterview,
  updateMockInterview,
} from '../controllers/mockInterviewController.js';

const router = Router();

router.use(requireAuth);
router.get('/', getMockInterviews);
router.post('/', validateBody(mockInterviewCreateSchema), createMockInterview);
router.put('/:id', validateBody(mockInterviewUpdateSchema), updateMockInterview);

export default router;