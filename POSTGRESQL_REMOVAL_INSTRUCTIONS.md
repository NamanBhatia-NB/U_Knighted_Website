# Instructions for Removing PostgreSQL and Using MongoDB Only

This guide provides instructions for completely removing PostgreSQL from this project and using MongoDB exclusively.

## Files to Remove

Remove these PostgreSQL-related files:

1. `/db/index.ts` - PostgreSQL database connection
2. `/db/seed.ts` - PostgreSQL seeding script
3. `/shared/schema.ts` - PostgreSQL schema definitions with Drizzle
4. `/drizzle.config.ts` - Drizzle ORM configuration
5. `/server/routes.ts` - PostgreSQL routes
6. `/server/index.ts` - PostgreSQL server

## Files to Keep/Rename

1. `/db/mongoose.js` - MongoDB connection
2. `/db/seed.js` - MongoDB seeding script
3. `/models/index.js` - MongoDB models
4. `/server/routes-mongo.js` - MongoDB routes
5. `/server/index-mongo.js` - MongoDB server

## Update Your Environment

1. Update `.env` file to contain MongoDB connection string:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

2. Update `package.json` to use MongoDB files:
   ```json
   "scripts": {
     "dev": "node server/index-mongo.js",
     "build": "vite build",
     "start": "NODE_ENV=production node server/index-mongo.js",
     "db:seed": "node db/seed.js"
   }
   ```

3. Remove PostgreSQL dependencies and install MongoDB:
   ```bash
   npm uninstall drizzle-orm drizzle-zod drizzle-kit pg
   npm install mongoose dotenv
   ```

## Client-Side Updates

The client-side code may still reference TypeScript types from the PostgreSQL schema. You should update these references to use your MongoDB model types instead.

1. Remove imports from `/shared/schema.ts`
2. Replace type references with equivalent MongoDB types

Example updates:
```typescript
// Before (PostgreSQL)
import { Member } from '@shared/schema'; 

// After (MongoDB)
interface Member {
  _id: string;
  name: string;
  role: string;
  email: string;
  eloRating: number;
  experienceLevel: string;
  bio?: string;
  photoUrl?: string;
  joinReason?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    chess?: string;
  };
  joinDate: Date;
}
```

## API Endpoints

All your API endpoints (/api/*) should now use the MongoDB implementation defined in `server/routes-mongo.js`.

## Local Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Set up your MONGO_URI in .env
3. Run `node db/seed.js` to initialize your database
4. Start the server with `node server/index-mongo.js`

## Important Notes

- MongoDB uses different query patterns than PostgreSQL
- MongoDB uses ObjectId instead of integer IDs
- Some date/time handling may be different
- Schema validation works differently in MongoDB vs PostgreSQL/Drizzle

This completes the migration from PostgreSQL to MongoDB.