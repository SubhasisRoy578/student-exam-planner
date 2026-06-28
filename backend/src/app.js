import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import apiRoutes from './routes/index.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(helmet());

// CORS restricted to the configured frontend origin only.
app.use(
  cors({
    origin: config.frontendUrl || '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Student Exam Planner API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      user: '/api/user',
      plan: '/api/plan',
      progress: '/api/progress',
      mocks: '/api/mock-interviews',
      achievements: '/api/achievements',
      dashboard: '/api/dashboard',
      guestSync: '/api/guest-sync'
    }
  });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api', apiLimiter, apiRoutes);

// 404 handler
app.use(notFoundHandler);
app.use(errorHandler);
