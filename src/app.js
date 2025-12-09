import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import requestLogger from './middleware/requestLogger.js';
import errorHandler from './middleware/errorHandler.js';
import searchRoutes from './routes/index.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/search', searchRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Restaurant Dish Search API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      searchDishes: 'GET /api/search/dishes?name=biryani&minPrice=150&maxPrice=300',
      documentation: 'https://github.com/yourusername/restaurant-api'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;