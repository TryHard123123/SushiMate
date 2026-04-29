# SushiMate Backend

Express mock API that feeds the frontend with catalog data and persists demo orders to MongoDB (or an in-memory store when the DB is disabled).

## Features

- `/api/products` and `/api/orders` routes with dedicated controllers
- Mongo-ready models defined in `models/Product.ts` + `models/Order.ts`
- Seed/import script (`scripts/importProducts.js`) for quickly loading the catalog
- CORS + JSON middleware with .env-driven port + database URI

## Commands

```bash
npm run dev --workspace apps/backend   # nodemon with hot reload
npm run start --workspace apps/backend # production mode
```

## Environment

Copy `.env.example` to `.env` and update the values:

```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/sushimate
```

If `MONGODB_URI` is omitted the app will fall back to an in-memory dataset so frontend devs can work without Mongo.
