// Utility to wrap async route handlers and forward errors to Express error middleware
module.exports = function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
