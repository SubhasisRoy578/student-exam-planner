// Authentication middleware. Verifies the JWT from the Authorization
// header, checks it hasn't been logged out (blocklist), and attaches
// the decoded user info to req.user.

import { verifyToken } from '../utils/jwt.js';
import { isTokenBlocklisted } from '../utils/tokenBlocklist.js';
import { ApiError } from '../utils/ApiError.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Missing or malformed Authorization header'));
  }

  if (isTokenBlocklisted(token)) {
    return next(new ApiError(401, 'Token has been invalidated. Please log in again.'));
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, email: payload.email };
    req.token = token;
    next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
}