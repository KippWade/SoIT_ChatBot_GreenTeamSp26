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
// Handle chatbot query
router.post('/ivybot', botController.query);

module.exports = router;
