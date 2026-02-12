import { defineConfig } from "drizzle-kit";

// No longer using PostgreSQL - using localStorage instead
// Keeping this file for potential future use

/*
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
*/

export default {};
