import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@repo/db";
import * as schema from "@repo/db";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  appName: "Lumina",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
