import pool from '../db/pool.js';

/**
 * Find top restaurants by dish name within price range
 * @param {string} name - Dish name (partial match)
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @param {number} limit - Result limit (default 10)
 * @returns {Promise<Array>} Array of restaurants with dish info
 */
export async function findTopRestaurantsByDish({ name, minPrice, maxPrice, limit = 10 }) {
  const conn = await pool.getConnection();
  try {
    const likeName = `%${name}%`;
    const [rows] = await conn.query(
      `
      SELECT
        r.id         AS restaurantId,
        r.name       AS restaurantName,
        r.city       AS city,
        mi.name      AS dishName,
        mi.price     AS dishPrice,
        COUNT(o.id)  AS orderCount
      FROM menu_items mi
      JOIN restaurants r ON r.id = mi.restaurant_id
      JOIN orders o      ON o.menu_item_id = mi.id
      WHERE
        mi.name LIKE ?
        AND mi.price BETWEEN ? AND ?
      GROUP BY
        r.id,
        mi.id
      ORDER BY
        orderCount DESC
      LIMIT ?
      `,
      [likeName, minPrice, maxPrice, limit]
    );
    return rows;
  } finally {
    conn.release();
  }
}

export default { findTopRestaurantsByDish };
