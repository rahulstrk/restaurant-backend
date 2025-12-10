import express from 'express';
import morgan from 'morgan';
import searchRoutes from './routes/search.routes.js';
import { requestLogger, errorLogger } from './middlewares/logging.middleware.js';
import { securityHeaders, rateLimit, corsHeaders } from './middlewares/security-middleware.js';
import { validateSearchParams } from './middlewares/validation-middleware.js';
import { responseFormatter } from './middlewares/response-middleware.js';
import { notFoundHandler, errorHandler } from './middlewares/error-handler-middleware.js';

const app = express();

// ============================================
// LAYER 1: Built-in & Third-party Middleware
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logging (Morgan)
app.use(morgan('dev'));

// ============================================
// LAYER 2: Security Middleware
// ============================================
app.use(corsHeaders);           // CORS headers
app.use(securityHeaders);       // Security headers (XSS, Clickjacking, etc.)
app.use(rateLimit);             // Rate limiting per IP

// ============================================
// LAYER 3: Custom Logging Middleware
// ============================================
app.use(requestLogger);         // Request tracking with request ID
app.use(errorLogger);           // Error logging middleware

// ============================================
// LAYER 4: Response Formatting Middleware
// ============================================
app.use(responseFormatter);     // Standardized response format

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// ============================================
// API ROUTES
// ============================================
// Apply validation middleware to search routes
app.use('/search', validateSearchParams, searchRoutes);

// ============================================
// LAYER 5: Error Handling Middleware
// ============================================
// 404 Not Found Handler (must come after all routes)
app.use(notFoundHandler);

// Global Error Handler (must be last middleware)
app.use(errorHandler);

export default app;
