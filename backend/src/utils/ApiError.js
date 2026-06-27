// Custom error class carrying an HTTP status code, so the error
// middleware can return the right status without string-matching
// error messages.

export class ApiError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}