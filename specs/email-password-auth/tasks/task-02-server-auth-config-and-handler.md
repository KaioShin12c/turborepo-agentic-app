# Task 02: Add Server Auth Config and API Handler

## Status

complete

## Wave

2

## Description

Create the Better Auth server configuration and expose its request handler through the TanStack app. This turns the database schema foundation from task 01 into real auth API endpoints under `/api/auth/*`, including endpoints used by `signUp.email`. The config must enable email/password auth and use the existing Drizzle connection from `@repo/db`.

## Dependencies

**Depends on:** task-01-auth-dependencies-and-schema.md
**Blocks:** task-03-client-signup-integration.md

**Context from dependencies:** Task 01 installs Better Auth dependencies and exports Drizzle schema tables named `user`, `session`, `account`, and `verification` from `@repo/db`. This task imports `db` and schema from `@repo/db`, configures the Better Auth Drizzle adapter with PostgreSQL provider `pg`, and creates the API handler that the client will call.

## Files to Create

- `apps/tanstack-app/src/lib/auth.ts` — Better Auth server config exporting `auth`.
- `apps/tanstack-app/src/routes/api/auth/$.ts` — catch-all TanStack Start server route that delegates to `auth.handler`.

## Files to Modify

- None expected unless package exports or route conventions require a small adjustment.

## Technical Details

### Implementation Steps

1. Inspect existing TanStack Start route conventions in `apps/tanstack-app/src/routes`. The app currently has file routes like `signup.tsx`, `login.tsx`, `index.tsx`, and `__root.tsx`.
2. Create `apps/tanstack-app/src/lib/auth.ts`.
3. Import `betterAuth` from `better-auth`, `drizzleAdapter` from `@better-auth/drizzle-adapter`, and `db` plus schema symbols from `@repo/db`.
4. Configure Better Auth with `database: drizzleAdapter(db, { provider: "pg", schema })`, `emailAndPassword: { enabled: true }`, and `appName: "Lumina"`.
5. Do not hard-code secrets if env vars exist; Better Auth reads `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`.
6. Create the catch-all API route so requests to `/api/auth/*` call `auth.handler(request)`.
7. Keep the implementation minimal and framework-native. Do not add custom auth endpoints.

### Code Snippets

Server config shape:

```ts
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
```

TanStack Start route handlers vary by version. Use the local app's installed TanStack Start conventions. The intended behavior is equivalent to:

```ts
import { createFileRoute } from "@tanstack/react-router";
import { auth } from "../../../lib/auth";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => auth.handler(request),
      POST: ({ request }) => auth.handler(request),
    },
  },
});
```

If the exact API differs, use the TanStack Start server route API available in this repo and verify that GET/POST requests under `/api/auth/*` are forwarded to `auth.handler`.

### Environment Variables

- `DATABASE_URL` — consumed by `@repo/db`.
- `BETTER_AUTH_SECRET` — required by Better Auth in real environments; minimum 32 characters. Generate with `pnpm dlx auth@latest secret` or `openssl rand -base64 32`.
- `BETTER_AUTH_URL` — app base URL, e.g. `http://localhost:3000` locally.

### API Endpoints

- `GET /api/auth/*` — forwarded to Better Auth.
- `POST /api/auth/*` — forwarded to Better Auth.
- `GET /api/auth/ok` — should return `{ status: "ok" }` when Better Auth is wired correctly.

## Acceptance Criteria

- [ ] `apps/tanstack-app/src/lib/auth.ts` exports a Better Auth `auth` configured with the Drizzle adapter and PostgreSQL provider.
- [ ] Email/password auth is enabled with `emailAndPassword.enabled = true`.
- [ ] Auth config relies on `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` rather than hard-coded secrets.
- [ ] `/api/auth/*` GET and POST requests are routed to `auth.handler`.
- [ ] No insecure Better Auth advanced options such as `disableCSRFCheck` or `disableOriginCheck` are introduced.

## Notes

Better Auth docs say the CLI searches for `auth.ts` in common root/lib/src locations. Keeping the config at `apps/tanstack-app/src/lib/auth.ts` is compatible with app-local config discovery when run with `--config apps/tanstack-app/src/lib/auth.ts` if needed.
