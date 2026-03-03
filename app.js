
/**
 * Main application entry point.
 * Sets up Express server, middleware, routes, and error handling.
 */
require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const botRoutes = require('./routes/botRoutes');
const fuzz = require('fuzzball'); // Used for fuzzy string matching
const config = require('./config/config');

// Initialize Express app
const app = express();
const PORT = config.port;

// Create a rate limiter for POST requests
const postLimiter = rateLimit(config.rateLimit);

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Start server
app.listen(PORT, () => {
    console.log(`${new Date().toISOString()} :: Server started on port ${PORT}`);
});

// Middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(postLimiter); // Apply rate limiting

// Main routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});
app.get('/test', (req, res) => {
    res.render('test', { title: 'Home' });
});

// Bot-related routes
app.use(botRoutes);

// 404 page for unmatched routes
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});

// Centralized error handler (handles errors from all routes/middleware)
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);
