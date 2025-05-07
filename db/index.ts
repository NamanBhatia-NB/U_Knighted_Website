import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// This is the correct way neon config - DO NOT change this
neonConfig.webSocketConstructor = ws;

if (!process.env.MONGO_URI) {
  throw new Error(
    "MONGO_URI must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.MONGO_URI });
export const db = drizzle({ client: pool, schema });