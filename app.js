
/**
 * Main Application Entry Point
 *
 * This file initializes and configures the Express server for the chatbot application. It is responsible for:
 *   - Loading environment variables and configuration
 *   - Setting up core middleware (static files, body parsing, logging, rate limiting)
 *   - Registering main routes and bot-related routes
 *   - Handling 404 errors and centralized error handling
 *   - Starting the HTTP server
 *
 * Designed for maintainability and extensibility to support future middleware, route, or configuration changes.
 *
 * @file app.js
 */
require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const botRoutes = require('./routes/botRoutes');
const fuzz = require('fuzzball'); // Used for fuzzy string matching
const config = require('./config/config');
const registerCoreMiddleware = require('./middlewares/core');

// =========================
// Initialize Express app and configuration
// =========================
const app = express();
const PORT = config.port;

// =========================
// Rate Limiting
// =========================
const postLimiter = rateLimit(config.rateLimit);

// =========================
// View Engine Setup
// =========================
app.set('view engine', 'ejs');

// =========================
// Start HTTP Server
// =========================
app.listen(PORT, () => {
    console.log(`${new Date().toISOString()} :: Server started on port ${PORT}`);
});

// =========================
// Core Middleware & Static Files
// =========================
registerCoreMiddleware(app);
// =========================
// Main Routes
// =========================
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});
app.get('/test', (req, res) => {
    res.render('test', { title: 'Home' });
});

// =========================
// Bot-Related Routes
// =========================
app.use(botRoutes);

// =========================
// 404 Handler for Unmatched Routes
// =========================
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// =========================
// Centralized Error Handler
// =========================
/**
 * Handles errors from all routes and middleware, rendering an error page or JSON as appropriate.
 * @see middlewares/errorHandler.js
 */
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);
