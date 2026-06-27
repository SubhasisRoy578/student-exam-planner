// Auth controller: register, verify email, login, logout,
// forgot/reset password.

import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken, verifyToken } from '../utils/jwt.js';
import { generateToken } from '../utils/token.js';
import { blocklistToken } from '../utils/tokenBlocklist.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../config/mailer.js';

export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Avoid confirming account existence too explicitly; still informative enough for UX.
    throw new ApiError(409, 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, config.bcryptSaltRounds);
  const verificationToken = generateToken();
  const verificationExpires = new Date(Date.now() + config.tokens.verificationExpiryHours * 60 * 60 * 1000);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      verificationToken,
      verificationExpires,
    },
  });

  await sendVerificationEmail(email, verificationToken);

  res.status(201).json({ message: 'Verification email sent' });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const user = await prisma.user.findUnique({ where: { verificationToken: token } });

  if (!user || !user.verificationExpires || user.verificationExpires < new Date()) {
    throw new ApiError(400, 'Verification link is invalid or has expired');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verificationToken: null,
      verificationExpires: null,
    },
  });

  res.json({ message: 'Email verified' });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.emailVerified) {
    throw new ApiError(403, 'Please verify your email before logging in');
  }

  const token = signToken(user);

  res.json({
    token,
    user: { id: user.id, email: user.email, verified: user.emailVerified },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const { token } = req;
  const decoded = verifyToken(token); // already validated by middleware, just need exp
  blocklistToken(token, decoded.exp * 1000);

  res.json({ message: 'Logged out' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return the same response whether or not the email exists,
  // to avoid leaking which emails are registered.
  if (user) {
    const resetToken = generateToken();
    const resetExpires = new Date(Date.now() + config.tokens.resetPasswordExpiryMinutes * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    await sendPasswordResetEmail(email, resetToken);
  }

  res.json({ message: 'Reset link sent' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, new_password } = req.body;

  const user = await prisma.user.findUnique({ where: { resetPasswordToken: token } });

  if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
    throw new ApiError(400, 'Reset link is invalid or has expired');
  }

  const passwordHash = await bcrypt.hash(new_password, config.bcryptSaltRounds);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  res.json({ message: 'Password updated' });
});