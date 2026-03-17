/**
 * Bot Routes
 * Defines routes for chatbot interactions (GET and POST /ivybot).
 * @module routes/botRoutes
 */
const { Router } = require('express');
const botController = require('../controllers/botController');

const router = Router();

// Render chatbot page
router.get('/ivybot', botController.response);
// Handle chatbot query with rate limiting
const rateLimit = require('express-rate-limit');
const config = require('../config/config');
const postLimiter = rateLimit(config.rateLimit);
const asyncHandler = require('../middlewares/asyncHandler');
router.post('/ivybot', postLimiter, asyncHandler(botController.query));

module.exports = router;
