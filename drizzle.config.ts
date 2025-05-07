import { defineConfig } from "drizzle-kit";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI, ensure the database is provisioned");
}

export default defineConfig({
  out: "./db/migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.MONGO_URI,
  },
  verbose: true,
});
