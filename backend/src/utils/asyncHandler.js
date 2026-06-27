// Wraps async route handlers so thrown errors / rejected promises are
// forwarded to Express's error-handling middleware automatically,
// instead of requiring try/catch in every controller.

/**
 * @param {Function} fn - async (req, res, next) => void
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}