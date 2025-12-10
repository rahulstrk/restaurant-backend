/**
 * Response Formatting Middleware
 * Formats successful responses consistently
 */
export function responseFormatter(req, res, next) {
  // Store original json method
  const originalJson = res.json;

  // Override json method to add metadata
  res.json = function(data) {
    const response = {
      success: true,
      status: this.statusCode,
      data: data,
      timestamp: new Date().toISOString()
    };

    return originalJson.call(this, response);
  };

  next();
}

export default { responseFormatter };
