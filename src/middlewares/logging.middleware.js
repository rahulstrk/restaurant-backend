/**
 * Logging Middleware
 * Logs detailed information about each request
 */
export function requestLogger(req, res, next) {
  const startTime = Date.now();
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Attach requestId to request object for tracking
  req.id = requestId;

  // Log incoming request
  // eslint-disable-next-line no-console
  console.log(`[${requestId}] ➜ ${req.method} ${req.path}`);
  
  // Log query parameters if present
  if (Object.keys(req.query).length > 0) {
    // eslint-disable-next-line no-console
    console.log(`[${requestId}]    Query: ${JSON.stringify(req.query)}`);
  }

  // Hook into response to log when request completes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusColor = res.statusCode >= 400 ? '❌' : '✅';
    
    // eslint-disable-next-line no-console
    console.log(
      `[${requestId}] ${statusColor} ${res.statusCode} - ${duration}ms`
    );
  });

  next();
}

/**
 * Error Logging Middleware
 * Logs errors that occur during request processing
 */
export function errorLogger(err, req, res, next) {
  const requestId = req.id || 'unknown';
  
  // eslint-disable-next-line no-console
  console.error(`[${requestId}]  ERROR: ${err.message}`);
  
  if (err.stack) {
    // eslint-disable-next-line no-console
    console.error(`[${requestId}]    Stack:`, err.stack);
  }

  // Pass to next error handler
  next(err);
}

export default { requestLogger, errorLogger };
