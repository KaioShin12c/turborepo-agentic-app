import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import * as schema from "@repo/db";
import { db } from "@repo/db";
import { env } from "@repo/env";
import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const auth = betterAuth({
  appName: "Lumina",
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [tanstackStartCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;
