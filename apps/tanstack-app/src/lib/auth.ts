import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@repo/db";
import * as schema from "@repo/db";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  appName: "Lumina",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
