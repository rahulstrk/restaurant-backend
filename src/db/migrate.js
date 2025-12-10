import pool from './pool.js';

export async function migrate() {
  const conn = await pool.getConnection();
  try {
    console.log('Running migrations...');

    // Create restaurants table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ restaurants table created');

    // Create menu_items table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        restaurant_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        price INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
        INDEX idx_menu_items_name_price (name, price)
      )
    `);
    console.log('✓ menu_items table created');

    // Create orders table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        menu_item_id INT NOT NULL,
        ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
        INDEX idx_orders_menu_item_id (menu_item_id)
      )
    `);
    console.log('✓ orders table created');

    console.log('All migrations completed successfully');
  } catch (err) {
    console.error(' Migration failed:', err.message);
    throw err;
  } finally {
    conn.release();
  }
}

export default { migrate };
