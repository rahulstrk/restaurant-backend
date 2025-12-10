import * as searchRepository from '../repositories/search.repository.js';

/**
 * Search for dishes by name with price range filter
 * @param {string} name - Dish name (required)
 * @param {number} minPrice - Minimum price (required)
 * @param {number} maxPrice - Maximum price (required)
 * @returns {Promise<Object>} Search results
 * @throws {Error} If validation fails
 */
export async function searchDishesByName({ name, minPrice, maxPrice }) {
  // Validate required parameters
  if (!name || name.trim() === '') {
    const error = new Error('Query parameter "name" is required');
    error.status = 400;
    throw error;
  }

  if (minPrice == null || maxPrice == null) {
    const error = new Error('Query parameters "minPrice" and "maxPrice" are required');
    error.status = 400;
    throw error;
  }

  // Validate and convert to numbers
  const min = Number(minPrice);
  const max = Number(maxPrice);

  if (Number.isNaN(min) || Number.isNaN(max)) {
    const error = new Error('"minPrice" and "maxPrice" must be numeric');
    error.status = 400;
    throw error;
  }

  // Validate price range logic
  if (min > max) {
    const error = new Error('"minPrice" cannot be greater than "maxPrice"');
    error.status = 400;
    throw error;
  }

  // Ensure non-negative prices
  if (min < 0 || max < 0) {
    const error = new Error('Prices cannot be negative');
    error.status = 400;
    throw error;
  }

  // Execute search
  const restaurants = await searchRepository.findTopRestaurantsByDish({
    name: name.trim(),
    minPrice: min,
    maxPrice: max,
    limit: 10
  });

  return { restaurants };
}

export default { searchDishesByName };
