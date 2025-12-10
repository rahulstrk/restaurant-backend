/**
 * Request Validation Middleware
 * Validates query parameters before they reach the controller
 */
export function validateSearchParams(req, res, next) {
  const { name, minPrice, maxPrice } = req.query;

  // Check for required parameters
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Query parameter "name" is required');
  }

  if (minPrice == null) {
    errors.push('Query parameter "minPrice" is required');
  }

  if (maxPrice == null) {
    errors.push('Query parameter "maxPrice" is required');
  }

  // If there are errors, return immediately
  if (errors.length > 0) {
    return res.status(400).json({
      error: errors.join('; '),
      status: 400,
      timestamp: new Date().toISOString()
    });
  }

  // Check if prices are numeric
  const min = Number(minPrice);
  const max = Number(maxPrice);

  if (Number.isNaN(min) || Number.isNaN(max)) {
    return res.status(400).json({
      error: '"minPrice" and "maxPrice" must be numeric',
      status: 400,
      timestamp: new Date().toISOString()
    });
  }

  // Check price range logic
  if (min > max) {
    return res.status(400).json({
      error: '"minPrice" cannot be greater than "maxPrice"',
      status: 400,
      timestamp: new Date().toISOString()
    });
  }

  // Check for negative prices
  if (min < 0 || max < 0) {
    return res.status(400).json({
      error: 'Prices cannot be negative',
      status: 400,
      timestamp: new Date().toISOString()
    });
  }

  // Validation passed, proceed to next middleware
  next();
}

export default { validateSearchParams };
