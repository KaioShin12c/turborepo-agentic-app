# Task 01: Configure Better Auth GitHub Provider

## Status

complete

## Wave

1

## Description

Configure the Better Auth server to support GitHub OAuth. The app already has a Better Auth server instance backed by Drizzle/PostgreSQL and the user confirmed `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are already present in the environment. This task adds the server-side provider configuration needed before any client GitHub button can redirect through Better Auth.

## Dependencies

**Depends on:** None (Wave 1)
**Blocks:** task-03-github-auth-ui.md, task-04-verify-auth-and-migrations.md

**Context from dependencies:** No prior task is required. Current repo context: `apps/tanstack-app/src/lib/auth.ts` already imports `drizzleAdapter`, `db`, Better Auth schema, and `betterAuth`; it enables `emailAndPassword`; and `apps/tanstack-app/src/routes/api/auth/$.ts` already forwards `GET` and `POST` requests to `auth.handler` under `/api/auth/$`.

## Files to Create

None.

## Files to Modify

- `apps/tanstack-app/src/lib/auth.ts` — add Better Auth `socialProviders.github` configuration while preserving the existing Drizzle adapter and email/password setup.

## Technical Details

### Implementation Steps

1. Open `apps/tanstack-app/src/lib/auth.ts`.
2. Preserve the existing imports and database configuration:
   - `drizzleAdapter(db, { provider: "pg", schema })`
   - `emailAndPassword: { enabled: true }`
   - existing `appName` and `baseURL` behavior unless there is a clear Better Auth issue.
3. Add a `socialProviders` object with GitHub credentials from environment variables.
4. Do not add custom OAuth routes manually. Better Auth handles the provider routes through the existing catch-all route at `/api/auth/*`.
5. Do not set `disableCSRFCheck` or `disableOriginCheck`.

### Code Snippets

Use this Better Auth pattern:

```ts
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
```

### Environment Variables

- `GITHUB_CLIENT_ID` — GitHub OAuth app client ID. The user said this already exists.
- `GITHUB_CLIENT_SECRET` — GitHub OAuth app client secret. The user said this already exists.
- `BETTER_AUTH_SECRET` — Better Auth secret, normally at least 32 characters.
- `BETTER_AUTH_URL` — App base URL, for example `http://localhost:3000` locally.
- `DATABASE_URL` — Required by `@repo/db` and Drizzle tooling.

### API Endpoints

- `GET /api/auth/*` — handled by `auth.handler` via `apps/tanstack-app/src/routes/api/auth/$.ts`.
- `POST /api/auth/*` — handled by `auth.handler` via `apps/tanstack-app/src/routes/api/auth/$.ts`.
- GitHub callback is expected to be handled by Better Auth under `/api/auth/callback/github`.

## Acceptance Criteria

- [ ] `apps/tanstack-app/src/lib/auth.ts` includes `socialProviders.github` with `process.env.GITHUB_CLIENT_ID!` and `process.env.GITHUB_CLIENT_SECRET!`.
- [ ] Existing `emailAndPassword.enabled` remains true.
- [ ] Existing Drizzle adapter configuration remains intact and uses `provider: "pg"` plus the imported schema.
- [ ] No manual GitHub OAuth route is added outside Better Auth's handler.
- [ ] No insecure Better Auth advanced flags such as `disableCSRFCheck` or `disableOriginCheck` are introduced.

## Notes

The GitHub OAuth app must allow the callback URL matching the runtime `BETTER_AUTH_URL`, typically `${BETTER_AUTH_URL}/api/auth/callback/github`. This is a manual setup item captured in `action-required.md`.
