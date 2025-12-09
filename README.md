# Restaurant Backend Service

A simple Node.js + MySQL backend for searching restaurants by dish name and price range.

## Features
- Search for restaurants by dish name and price range
- Returns top 10 restaurants by order count for the dish
- Clean, modular code using ES6 modules
- Environment-based configuration
- Sample data seeding and SQL schema included

## Prerequisites
- Node.js (v14+ recommended)
- MySQL (v5.7+ recommended)

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Restaurant-Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your MySQL credentials.
   - Example:
     ```
     DB_HOST=localhost
     DB_USER=restaurant_user
     DB_PASSWORD=your_password
     DB_NAME=restaurant_db
     DB_PORT=3306
     DB_CONNECTION_LIMIT=10
     DB_WAIT_FOR_CONNECTIONS=true
     ```

4. **Create the database:**
   - Log in to MySQL and run:
     ```sql
     CREATE DATABASE restaurant_db;
     ```

5. **Create tables:**
   - Run the schema SQL:
     ```bash
     mysql -u <user> -p restaurant_db < db/schema.sql
     ```

6. **Seed sample data:**
   - (If you have a seed script) Run:
     ```bash
     npm run seed
     ```

7. **Start the server:**
   ```bash
   npm run dev
   # or
   node index.js
   ```

## API Usage

### Search Dishes
- **Endpoint:** `GET /search/dishes?name=<dish>&minPrice=<min>&maxPrice=<max>`
- **Returns:** Top 10 restaurants with the most orders for the dish in the price range.
- **Example:**
  ```
  GET /search/dishes?name=biryani&minPrice=150&maxPrice=300
  ```
- **Sample Response:**
  ```json
  {
    "restaurants": [
      {
        "restaurantId": 1,
        "restaurantName": "Hyderabadi Spice House",
        "city": "Hyderabad",
        "dishName": "Chicken Biryani",
        "dishPrice": 220,
        "orderCount": 96
      }
    ]
  }
  ```

### Health Check
- **Endpoint:** `GET /health`
- **Returns:** `{ status: 'Server is running' }`

## Project Structure
```
.
├── index.js                # Server entry point
├── .env.example            # Environment variable template
├── db/
│   └── schema.sql          # SQL schema for tables
├── scripts/
│   └── seed.js             # (Optional) Data seeding script
└── src/
    ├── app.js              # Express app setup
    ├── config/
    │   └── database.js     # MySQL connection pool
    ├── middleware/         # Error handler, logger, etc.
    └── routes/             # API routes
```

## Notes
- Use a dedicated MySQL user (not root) for security.
- All configuration is via `.env`.
- For any issues, check your database connection and credentials first.
