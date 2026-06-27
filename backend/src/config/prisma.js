// Singleton Prisma client. Reusing one instance across the app avoids
// exhausting database connections, which is a common bug with
// per-request `new PrismaClient()` calls.

import { PrismaClient } from '@prisma/client';
import { config } from './env.js';

export const prisma = new PrismaClient({
  log: config.nodeEnv === 'development' ? ['warn', 'error'] : ['error'],
});