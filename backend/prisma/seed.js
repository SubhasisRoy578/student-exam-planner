// Seed script: creates one demo user (pre-verified, password "Demo1234!")
// with sample plan, progress, mock interview, and achievement data.
// Run with: npm run seed

import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Demo1234!', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@examplanner.app' },
    update: {},
    create: {
      email: 'demo@examplanner.app',
      passwordHash,
      emailVerified: true,
    },
  });

  const existingPlan = await prisma.studentPlan.findFirst({ where: { userId: user.id } });
  if (!existingPlan) {
    await prisma.studentPlan.create({
      data: {
        userId: user.id,
        examDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        goal: 'Score 90+ on the final exam',
        weakSubjects: ['Organic Chemistry', 'Calculus II'],
        dailyHours: 3.5,
      },
    });
  }

  await prisma.progress.upsert({
    where: { userId_subjectName: { userId: user.id, subjectName: 'Organic Chemistry' } },
    update: {},
    create: {
      userId: user.id,
      subjectName: 'Organic Chemistry',
      masteryPercentage: 42,
      completedTasks: ['Reaction mechanisms', 'Functional groups'],
    },
  });

  await prisma.progress.upsert({
    where: { userId_subjectName: { userId: user.id, subjectName: 'Calculus II' } },
    update: {},
    create: {
      userId: user.id,
      subjectName: 'Calculus II',
      masteryPercentage: 65,
      completedTasks: ['Integration by parts', 'Series convergence'],
    },
  });

  const existingMock = await prisma.mockInterview.findFirst({ where: { userId: user.id } });
  if (!existingMock) {
    await prisma.mockInterview.create({
      data: {
        userId: user.id,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  const existingAchievement = await prisma.achievement.findFirst({ where: { userId: user.id } });
  if (!existingAchievement) {
    await prisma.achievement.create({
      data: {
        userId: user.id,
        logEntry: 'Completed 2-hour study session on Calculus II',
        streakCount: 1,
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log('Seed complete. Demo login: demo@examplanner.app / Demo1234!');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });