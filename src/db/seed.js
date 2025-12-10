import pool from './pool.js';

export async function seed() {
  const conn = await pool.getConnection();
  try {
    console.log('Seeding database...');

    await conn.beginTransaction();

    // Clear existing data
    await conn.query('DELETE FROM orders');
    await conn.query('DELETE FROM menu_items');
    await conn.query('DELETE FROM restaurants');
    console.log('✓ Cleared existing data');

    // Insert restaurants
    const [restaurantResult] = await conn.query(
      `INSERT INTO restaurants (name, city) VALUES
        ('Hyderabadi Spice House', 'Hyderabad'),
        ('Biryani Palace', 'Hyderabad'),
        ('Bombay Biryani Corner', 'Mumbai'),
        ('Delhi Butter Chicken', 'Delhi'),
        ('Kolkata Fried Rice Hub', 'Kolkata')`
    );
    console.log('✓ Inserted 5 restaurants');

    const firstRestaurantId = restaurantResult.insertId;

    // Insert menu items
    const menuItemsData = [
      [firstRestaurantId, 'Chicken Biryani', 220],
      [firstRestaurantId, 'Mutton Biryani', 280],
      [firstRestaurantId, 'Veg Biryani', 180],
      [firstRestaurantId + 1, 'Chicken Biryani', 250],
      [firstRestaurantId + 1, 'Veg Biryani', 170],
      [firstRestaurantId + 1, 'Lamb Biryani', 300],
      [firstRestaurantId + 2, 'Chicken Biryani', 210],
      [firstRestaurantId + 2, 'Biryani Special', 240],
      [firstRestaurantId + 3, 'Butter Chicken', 180],
      [firstRestaurantId + 3, 'Biryani Rice', 200],
      [firstRestaurantId + 4, 'Fried Rice', 150],
      [firstRestaurantId + 4, 'Chicken Biryani', 190]
    ];

    const [menuItemsResult] = await conn.query(
      'INSERT INTO menu_items (restaurant_id, name, price) VALUES ?',
      [menuItemsData]
    );
    console.log('✓ Inserted 12 menu items');

    const firstMenuItemId = menuItemsResult.insertId;

    // Generate orders with varying counts
    const ordersData = [];

    // Chicken Biryani at Hyderabadi Spice House - 96 orders
    for (let i = 0; i < 96; i += 1) {
      ordersData.push([firstMenuItemId]);
    }

    // Mutton Biryani at Hyderabadi Spice House - 45 orders
    for (let i = 0; i < 45; i += 1) {
      ordersData.push([firstMenuItemId + 1]);
    }

    // Veg Biryani at Hyderabadi Spice House - 38 orders
    for (let i = 0; i < 38; i += 1) {
      ordersData.push([firstMenuItemId + 2]);
    }

    // Chicken Biryani at Biryani Palace - 67 orders
    for (let i = 0; i < 67; i += 1) {
      ordersData.push([firstMenuItemId + 3]);
    }

    // Veg Biryani at Biryani Palace - 42 orders
    for (let i = 0; i < 42; i += 1) {
      ordersData.push([firstMenuItemId + 4]);
    }

    // Lamb Biryani at Biryani Palace - 28 orders
    for (let i = 0; i < 28; i += 1) {
      ordersData.push([firstMenuItemId + 5]);
    }

    // Chicken Biryani at Bombay Biryani Corner - 54 orders
    for (let i = 0; i < 54; i += 1) {
      ordersData.push([firstMenuItemId + 6]);
    }

    // Biryani Special at Bombay Biryani Corner - 31 orders
    for (let i = 0; i < 31; i += 1) {
      ordersData.push([firstMenuItemId + 7]);
    }

    // Butter Chicken at Delhi Butter Chicken - 50 orders
    for (let i = 0; i < 50; i += 1) {
      ordersData.push([firstMenuItemId + 8]);
    }

    // Biryani Rice at Delhi Butter Chicken - 35 orders
    for (let i = 0; i < 35; i += 1) {
      ordersData.push([firstMenuItemId + 9]);
    }

    // Fried Rice at Kolkata Fried Rice Hub - 72 orders
    for (let i = 0; i < 72; i += 1) {
      ordersData.push([firstMenuItemId + 10]);
    }

    // Chicken Biryani at Kolkata Fried Rice Hub - 43 orders
    for (let i = 0; i < 43; i += 1) {
      ordersData.push([firstMenuItemId + 11]);
    }

    await conn.query('INSERT INTO orders (menu_item_id) VALUES ?', [ordersData]);
    console.log(`✓ Inserted ${ordersData.length} orders`);

    await conn.commit();
    console.log(' Database seeded successfully');
  } catch (err) {
    await conn.rollback();
    console.error(' Seeding failed:', err.message);
    throw err;
  } finally {
    conn.release();
  }
}

export default { seed };
