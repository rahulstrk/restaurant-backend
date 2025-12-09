import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function createSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    // Create database
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );
    console.log('Database created or already exists');

    await connection.changeUser({ database: process.env.DB_NAME });

    // Create restaurants table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Restaurants table created');

    // Create menu_items table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        restaurant_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
      )
    `);
    console.log('Menu items table created');

    // Create orders table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        menu_item_id INT NOT NULL,
        restaurant_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
      )
    `);
    console.log('Orders table created');

    console.log('Schema created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating schema:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

createSchema();
