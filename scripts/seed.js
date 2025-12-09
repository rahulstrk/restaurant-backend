import pool from './src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedData() {
  const connection = await pool.getConnection();

  try {
    // Clear existing data
    await connection.execute('DELETE FROM orders');
    await connection.execute('DELETE FROM menu_items');
    await connection.execute('DELETE FROM restaurants');

    // Insert restaurants
    const restaurants = [
      ['Hyderabadi Spice House', 'Hyderabad'],
      ['Biryani Palace', 'Mumbai'],
      ['Royal Feast', 'Delhi'],
      ['Masala Kitchen', 'Bangalore'],
      ['Golden Tandoor', 'Chennai'],
    ];

    for (const [name, city] of restaurants) {
      await connection.execute(
        'INSERT INTO restaurants (name, city) VALUES (?, ?)',
        [name, city]
      );
    }
    console.log('Restaurants seeded');

    // Insert menu items
    const menuItems = [
      [1, 'Chicken Biryani', 220],
      [1, 'Mutton Biryani', 280],
      [2, 'Vegetable Biryani', 180],
      [2, 'Chicken Biryani', 200],
      [3, 'Biryani Special', 250],
      [3, 'Fish Biryani', 300],
      [4, 'Biryani Rice', 190],
      [5, 'Chicken Biryani', 210],
    ];

    for (const [restaurantId, name, price] of menuItems) {
      await connection.execute(
        'INSERT INTO menu_items (restaurant_id, name, price) VALUES (?, ?, ?)',
        [restaurantId, name, price]
      );
    }
    console.log('Menu items seeded');

    // Add multiple orders to reach the required counts
    for (let i = 0; i < 96; i++) {
      await connection.execute(
        'INSERT INTO orders (menu_item_id, restaurant_id) VALUES (?, ?)',
        [1, 1]
      );
    }
    for (let i = 0; i < 85; i++) {
      await connection.execute(
        'INSERT INTO orders (menu_item_id, restaurant_id) VALUES (?, ?)',
        [4, 2]
      );
    }
    for (let i = 0; i < 72; i++) {
      await connection.execute(
        'INSERT INTO orders (menu_item_id, restaurant_id) VALUES (?, ?)',
        [8, 5]
      );
    }
    for (let i = 0; i < 60; i++) {
      await connection.execute(
        'INSERT INTO orders (menu_item_id, restaurant_id) VALUES (?, ?)',
        [5, 3]
      );
    }
    for (let i = 0; i < 45; i++) {
      await connection.execute(
        'INSERT INTO orders (menu_item_id, restaurant_id) VALUES (?, ?)',
        [3, 2]
      );
    }

    console.log('Orders seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    connection.release();
  }
}

seedData();
