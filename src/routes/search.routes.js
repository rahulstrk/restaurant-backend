import express from 'express';
import * as searchController from '../controllers/search.controller.js';

const router = express.Router();

/**
 * GET /search/dishes
 * Search for restaurants by dish name with price range filter
 *
 * Query Parameters:
 * - name (string, required): Dish name
 * - minPrice (number, required): Minimum price
 * - maxPrice (number, required): Maximum price
 *
 * Response:
 * {
 *   "success": true,
 *   "status": 200,
 *   "data": {
 *     "restaurants": [
 *       {
 *         "restaurantId": 1,
 *         "restaurantName": "Restaurant Name",
 *         "city": "City Name",
 *         "dishName": "Dish Name",
 *         "dishPrice": 200,
 *         "orderCount": 50
 *       }
 *     ]
 *   },
 *   "timestamp": "2024-12-11T01:45:00.000Z"
 * }
 */
router.get('/dishes', searchController.searchDishes);

export default router;
