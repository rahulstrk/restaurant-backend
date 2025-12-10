/**
 * Error Handling Middleware
 * Centralized error handling and formatting
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    status: 404,
    timestamp: new Date().toISOString()
  });
}

/**
 * Global Error Handler Middleware
 * Catches all errors and formats them consistently
 * Must be the last middleware (after all routes and error handlers)
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const requestId = req.id || 'unknown';
  
  // Determine HTTP status code
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error details
  // eslint-disable-next-line no-console
  console.error(`[${requestId}] Error Handler: ${status} ${message}`);

  // Don't expose internal errors in production
  const isProduction = process.env.NODE_ENV === 'production';
  const responseMessage = isProduction && status === 500 
    ? 'Internal Server Error'
    : message;

  // Send error response
  res.status(status).json({
    error: responseMessage,
    status,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
}

export default { notFoundHandler, errorHandler };
