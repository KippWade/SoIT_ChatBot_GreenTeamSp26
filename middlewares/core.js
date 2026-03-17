// middlewares/core.js
// Registers core middleware for the Express app


const express = require('express');
const path = require('path');
const morgan = require('morgan');

module.exports = function registerCoreMiddleware(app) {
    // Static files
    app.use(express.static(path.join(__dirname, '../public')));
    // URL-encoded bodies
    app.use(express.urlencoded({ extended: true }));
    // Environment-specific logging
    const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
    app.use(morgan(logFormat));
    // JSON bodies
    app.use(express.json());
};
