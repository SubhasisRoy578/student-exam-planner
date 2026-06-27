// Centralized error handler. Must be registered last, after all routes.
// Normalizes ApiError, Prisma errors, and unexpected errors into a
// consistent JSON shape, and avoids leaking internals in production.

import { config } from '../config/env.js';

export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Prisma unique constraint violation (e.g. duplicate email).
  if (err.code === 'P2002') {
    statusCode = 409;
    message = `A record with this ${err.meta?.target?.join(', ') || 'value'} already exists`;
  }

  // Prisma "record not found" on update/delete.
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  if (statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
    if (config.nodeEnv === 'production') {
      message = 'Internal server error';
    }
  }

  res.status(statusCode).json({
    message,
    ...(config.nodeEnv !== 'production' && statusCode >= 500 ? { stack: err.stack } : {}),
  });
}