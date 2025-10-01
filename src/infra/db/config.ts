import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const { DB_USER, DB_HOST, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_USER || !DB_HOST || !DB_PASSWORD || !DB_NAME) {
  throw new Error("Missing database environment variables");
}

export const databaseUrl = `postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}`;

const db = drizzle(databaseUrl!);
