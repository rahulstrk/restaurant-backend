/**
 * Imports
 * - Express app from src/app.js
 * - Database connection from src/config/database.js
 * - Environment variables loader
 */
import app from './src/app.js';
import { testConnection } from './src/config/database.js';
import dotenv from 'dotenv';

/**
 * Configuration
 * - Load .env variables
 * - Set port and environment
 */
dotenv.config();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Main Function
 * - Test DB connection
 * - Start server
 * - Handle errors
 * - Setup shutdown handlers
 */
const startServer = async () => {
  try {
    // Test database
    const dbConnected = await testConnection();
    if (!dbConnected) throw new Error('DB failed');
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Handle shutdown signals
    process.on('SIGTERM', () => { /* cleanup */ });
    process.on('SIGINT', () => { /* cleanup */ });
    
  } catch (error) {
    console.error('Failed to start:', error.message);
    process.exit(1);
  }
};

// Start it!
startServer();
