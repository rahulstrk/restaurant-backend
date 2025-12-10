import * as searchService from '../services/search.service.js';

/**
 * Handle GET /search/dishes
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
export async function searchDishes(req, res, next) {
  try {
    const { name, minPrice, maxPrice } = req.query;

    const result = await searchService.searchDishesByName({
      name,
      minPrice,
      maxPrice
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export default { searchDishes };
