// Email sending via Nodemailer. Swap the transport for SendGrid/Resend
// in production by changing only this file.

import nodemailer from 'nodemailer';
import { config } from './env.js';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

/**
 * Sends an account verification email containing a one-time link.
 * @param {string} to - recipient email address
 * @param {string} token - verification token to embed in the link
 */
export async function sendVerificationEmail(to, token) {
  const link = `${config.frontendUrl}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: config.email.from,
    to,
    subject: 'Verify your Student Exam Planner account',
    html: `
      <p>Welcome to Student Exam Planner!</p>
      <p>Please verify your email by clicking the link below. This link expires in 24 hours.</p>
      <p><a href="${link}">${link}</a></p>
    `,
  });
}

/**
 * Sends a password reset email containing a one-time link.
 * @param {string} to - recipient email address
 * @param {string} token - reset token to embed in the link
 */
export async function sendPasswordResetEmail(to, token) {
  const link = `${config.frontendUrl}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: config.email.from,
    to,
    subject: 'Reset your Student Exam Planner password',
    html: `
      <p>We received a request to reset your password.</p>
      <p>This link expires in 30 minutes. If you didn't request this, you can ignore this email.</p>
      <p><a href="${link}">${link}</a></p>
    `,
  });
}