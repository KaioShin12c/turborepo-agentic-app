import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import path from "node:path";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  config({ path: path.resolve(__dirname, "../.env") });
}

export * from "./schema";
export * from "drizzle-orm";

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing");
}

const client = globalForDb.conn ?? postgres(connectionString);
if (process.env.NODE_ENV !== "production") globalForDb.conn = client;

export const db = drizzle(client, { schema });
