/**
 * Security Middleware
 * Adds security headers and protections
 */
export function securityHeaders(req, res, next) {
  // Prevent XSS attacks
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Remove server info
  res.setHeader('X-Powered-By', 'Restaurant Search API');

  // Content Security Policy
  res.setHeader('Content-Security-Policy', "default-src 'self'");

  next();
}

/**
 * Rate Limiting Middleware (Simple In-Memory)
 * Limits requests per IP address
 */
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;

export function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  // Get or create request record for this IP
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }

  const requests = requestCounts.get(ip);

  // Remove old requests outside the window
  const recentRequests = requests.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );

  // Check if limit exceeded
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Too many requests, please try again later',
      status: 429,
      retryAfter: 60,
      timestamp: new Date().toISOString()
    });
  }

  // Add current request timestamp
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
  res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS_PER_WINDOW - recentRequests.length);
  res.setHeader('X-RateLimit-Reset', new Date(now + RATE_LIMIT_WINDOW).toISOString());

  next();
}

/**
 * CORS Middleware
 * Enables cross-origin requests
 */
export function corsHeaders(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '3600');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
}

export default { securityHeaders, rateLimit, corsHeaders };
