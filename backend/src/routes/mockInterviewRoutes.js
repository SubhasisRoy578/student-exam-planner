import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { mockInterviewCreateSchema, mockInterviewUpdateSchema } from '../middleware/dataValidators.js';
import { getMockInterviews, createMockInterviews, updateMockInterviews } from '../controllers/mockInterviewController.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Get all mock interviews for the logged-in user
router.get('/', getMockInterviews);

// Create a new mock interview
router.post('/', validateBody(mockInterviewCreateSchema), createMockInterviews);

// Update a mock interview by ID
router.put('/:id', validateBody(mockInterviewUpdateSchema), updateMockInterviews);

export default router;
