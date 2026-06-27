// JWT helpers used by auth controller and middleware.

import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * Signs a JWT containing the user's id and email.
 * @param {{ id: string, email: string }} user
 * @returns {string} signed JWT
 */
export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

/**
 * Verifies a JWT and returns its decoded payload.
 * Throws if the token is invalid or expired.
 * @param {string} token
 */
export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}