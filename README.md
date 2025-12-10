# Restaurant Backend

A simple Node.js + MySQL backend that lets users search for restaurants by dish name within a price range and returns the top 10 results by order count.

## Overview

- Language/Framework: Node.js, Express
- Database: MySQL (mysql2)
- Architecture: routes → controller → service → repository → db
- Status: Migrations and seed scripts included; `/search/dishes` endpoint working locally

## Project Structure

```
src/
	app.js            # Express app and middleware
	server.js         # Entry point
	config/index.js   # Environment configuration
	db/pool.js        # MySQL connection pool
	routes/search.routes.js
	controllers/search.controller.js
	services/search.service.js
	repositories/search.repository.js
	middlewares/*     # logging, security, validation, response, error handlers
scripts/
	migrate.db.js     # Run schema migrations
	seed.db.js        # Seed sample data
```

## Prerequisites

- Node.js (v18+ recommended)
- MySQL server running locally or accessible remotely

## Environment Variables

Create a `.env` file in the project root:

```
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=restaurant_user
DB_PASSWORD=your_password
DB_NAME=restaurant_search
DB_CONNECTION_LIMIT=10
```

## Install

```zsh
npm install
```

## Database: Migrate and Seed

Run migrations to create tables and then seed with sample data.

```zsh
npm run migrate
npm run seed
```

If you see MySQL permission errors, ensure the database and user exist and have privileges.

## Run the server

```zsh
npm run dev    # starts with nodemon on PORT from .env
# or
npm start      # starts once without nodemon
```

Visit health check:

```
GET http://localhost:3000/health
```

## API

### Search dishes

Endpoint:

```
GET /search/dishes?name=<dish>&minPrice=<min>&maxPrice=<max>
```

Query parameters:

- `name` (string, required): dish name (partial match, case-insensitive)
- `minPrice` (number, required): minimum price in the restaurant's currency
- `maxPrice` (number, required): maximum price in the restaurant's currency

Response: 200 OK

```json
{
	"success": true,
	"data": [
		{
			"restaurantId": 1,
			"restaurantName": "Spice Hub",
			"city": "Bengaluru",
			"dishName": "Chicken Biryani",
			"dishPrice": 220,
			"orderCount": 57
		}
		// up to 10 entries
	],
	"timestamp": "2025-12-11T10:00:00.000Z"
}
```

Example curl:

```zsh
curl "http://localhost:3000/search/dishes?name=biryani&minPrice=200&maxPrice=250"
```

## Troubleshooting

- Port in use (EADDRINUSE): stop the other process using 3000, or change `PORT` in `.env`.
- MySQL connection errors: verify credentials and that the user has `SELECT/INSERT/UPDATE/DELETE` and `CREATE` privileges on `DB_NAME`.
- Migrations/seed not found: ensure you run commands from the project root.

## Deployment

You can deploy on free platforms like Railway or Render:

- Set environment variables from `.env` in the platform dashboard
- Provision a MySQL database (or connect to your own) and update `DB_*` vars
- On first deploy, run the migrate and seed commands via the platform console

## License

MIT

