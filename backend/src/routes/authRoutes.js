import { Router } from 'express';
import { validateBody } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  registerSchema,
  verifyEmailSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/authValidators.js';
import {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', authLimiter, validateBody(registerSchema), register);
router.post('/verify-email', authLimiter, validateBody(verifyEmailSchema), verifyEmail);
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.post('/forgot-password', authLimiter, validateBody(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validateBody(resetPasswordSchema), resetPassword);
router.post('/logout', requireAuth, logout);

export default router;