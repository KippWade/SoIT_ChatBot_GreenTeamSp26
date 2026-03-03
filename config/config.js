/**
 * Application configuration values.
 * Centralizes port and rate limiting settings for maintainability.
 *
 * @property {number|string} port - The port the server listens on.
 * @property {Object} rateLimit - Express rate limit configuration.
 */
module.exports = {
  port: process.env.PORT || 3030,
  rateLimit: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50,
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false
  }
};
