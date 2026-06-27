import { app } from './app.js';
import { config } from './config/env.js';
import { prisma } from './config/prisma.js';

const server = app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Student Exam Planner API listening on port ${config.port} [${config.nodeEnv}]`);
});

async function shutdown(signal) {
  // eslint-disable-next-line no-console
  console.log(`${signal} received: closing server gracefully`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));