// Cryptographically secure random tokens for email verification and
// password reset links. crypto.randomBytes is used instead of uuid
// here because these tokens are bearer secrets, not identifiers.

import crypto from 'crypto';

/**
 * Generates a URL-safe random token.
 * @param {number} bytes - number of random bytes (default 32 -> 64 hex chars)
 * @returns {string} hex-encoded token
 */
export function generateToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}