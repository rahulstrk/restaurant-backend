/**
 * Database Configuration and Connection Pool
 * File: src/config/database.js
 * 
 * Manages MySQL connections with connection pooling
 * - Creates and maintains connection pool
 * - Provides query execution methods
 * - Handles connection errors gracefully
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ============================================
// CONNECTION POOL
// ============================================

/**
 * Create connection pool
 * Connection pooling:
 * - Reuses connections instead of creating new ones
 * - Improves performance
 * - Manages limited number of connections
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'restaurant_db',
  
  // Pool configuration
  waitForConnections: true,      // Wait if pool is full
  connectionLimit: 10,           // Max 10 connections
  queueLimit: 0,                 // Unlimited queue
  enableKeepAlive: true,         // Keep connections alive
  keepAliveInitialDelayMs: 0     // No initial delay
});

// ============================================
// TEST CONNECTION
// ============================================

/**
 * Test database connection
 * Called from server.js during startup
 * 
 * @returns {Promise<boolean>} - True if connected, false otherwise
 * 
 * Usage:
 *   const connected = await testConnection();
 *   if (connected) { ... }
 */
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    
    console.log('✅ Database connection successful');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Database: ${process.env.DB_NAME}`);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Host: ${process.env.DB_HOST}`);
    console.error(`   User: ${process.env.DB_USER}`);
    
    return false;
  }
};

// ============================================
// QUERY EXECUTION
// ============================================

/**
 * Execute a query with parameters (RECOMMENDED)
 * Uses prepared statements for SQL injection prevention
 * 
 * @param {string} sql - SQL query string with ? placeholders
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} - Query results
 * 
 * Usage:
 *   const restaurants = await query(
 *     'SELECT * FROM restaurants WHERE dish_name = ?',
 *     ['biryani']
 *   );
 */
export const query = async (sql, params = []) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Query error:', error.message);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// ============================================
// BULK QUERIES
// ============================================

/**
 * Execute multiple queries without parameters
 * Use for READ-ONLY queries only
 * 
 * @param {string} sql - SQL query string
 * @returns {Promise<Array>} - Query results
 * 
 * Usage:
 *   const allRestaurants = await queryRaw(
 *     'SELECT * FROM restaurants'
 *   );
 */
export const queryRaw = async (sql) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.query(sql);
    return results;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// ============================================
// TRANSACTIONS
// ============================================

/**
 * Get a connection from the pool (for transactions)
 * Allows manual transaction control
 * 
 * @returns {Promise<Connection>} - MySQL connection
 * 
 * Usage:
 *   const connection = await getConnection();
 *   try {
 *     await connection.beginTransaction();
 *     await connection.execute(sql1, params1);
 *     await connection.execute(sql2, params2);
 *     await connection.commit();
 *   } catch (error) {
 *     await connection.rollback();
 *   } finally {
 *     connection.release();
 *   }
 */
export const getConnection = async () => {
  return await pool.getConnection();
};

/**
 * Execute queries within a transaction
 * Ensures all-or-nothing execution
 * 
 * @param {Function} callback - Function that executes queries
 * @returns {Promise} - Transaction result
 * 
 * Usage:
 *   await transaction(async (conn) => {
 *     await conn.execute(sql1, params1);
 *     await conn.execute(sql2, params2);
 *   });
 */
export const transaction = async (callback) => {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// ============================================
// POOL MANAGEMENT
// ============================================

/**
 * Get pool statistics
 * Useful for monitoring
 * 
 * @returns {Object} - Pool info
 */
export const getPoolStats = () => {
  return {
    activeConnections: pool._allConnections?.length || 0,
    idleConnections: pool._freeConnections?.length || 0,
    waitingConnections: pool._connectionQueue?.length || 0
  };
};

/**
 * Close all connections in the pool
 * Called on server shutdown
 * 
 * Usage:
 *   await closePool();
 *   process.exit(0);
 */
export const closePool = async () => {
  try {
    await pool.end();
    console.log('✅ Database connection pool closed');
  } catch (error) {
    console.error('Error closing pool:', error.message);
  }
};

// ============================================
// EXPORTS
// ============================================

export { pool };