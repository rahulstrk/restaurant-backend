/**
 * Helper Functions
 * Reusable utility functions for the application
 */

/**
 * Format API response
 * @param {boolean} success - Request success status
 * @param {string} message - Message
 * @param {*} data - Response data
 * @returns {Object} - Formatted response
 */
export const formatResponse = (success, message, data = null) => {
  return {
    success,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

/**
 * Format error response
 * @param {string} error - Error message
 * @param {*} details - Error details
 * @returns {Object} - Formatted error response
 */
export const formatError = (error, details = null) => {
  return {
    success: false,
    error,
    details,
    timestamp: new Date().toISOString()
  };
};

/**
 * Get environment variable safely
 * @param {string} key - Environment variable key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} - Environment variable value or default
 */
export const getEnv = (key, defaultValue = null) => {
  const value = process.env[key];
  return value !== undefined ? value : defaultValue;
};

/**
 * Log with timestamp
 * @param {string} level - Log level (INFO, ERROR, WARN, DEBUG)
 * @param {string} message - Log message
 * @param {*} data - Additional data
 */
export const log = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const output = {
    timestamp,
    level,
    message,
    ...(data && { data })
  };
  console.log(JSON.stringify(output));
};

/**
 * Sleep/delay execution
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Initial delay in ms
 * @returns {Promise}
 */
export const retry = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(delay * Math.pow(2, i));
    }
  }
};