# Task 04: Verify Auth and Database Workflow

## Status

pending

## Wave

3

## Description

Verify the completed Better Auth implementation and database workflow. Authentication touches server configuration, client behavior, environment variables, and Drizzle schema/migrations, so this final task ensures the feature is buildable and follows repo rules. This task should not add new auth features; it should validate, fix small integration issues if found, and report any environment-dependent checks that cannot run.

## Dependencies

**Depends on:** task-01-server-github-provider.md, task-02-login-email-password.md, task-03-github-auth-ui.md
**Blocks:** None

**Context from dependencies:** Task 01 configures GitHub OAuth on the Better Auth server. Task 02 wires the login form to `authClient.signIn.email` with `email`, `password`, `rememberMe`, and `callbackURL`. Task 03 wires GitHub buttons on login and signup to `authClient.signIn.social({ provider: "github", callbackURL: "/" })`. The existing repo already has Better Auth Drizzle tables in `packages/db/src/schema.ts` and an auth route at `apps/tanstack-app/src/routes/api/auth/$.ts`.

## Files to Create

None expected. If Drizzle detects schema changes, migration files may be created under `packages/db/drizzle/` by `pnpm db:generate`.

## Files to Modify

- `apps/tanstack-app/src/lib/auth.ts` — only if verification finds small configuration issues.
- `apps/tanstack-app/src/components/login-page.tsx` — only if verification finds compile/type/integration issues.
- `apps/tanstack-app/src/components/signup-page.tsx` — only if verification finds compile/type/integration issues.
- `packages/db/src/schema.ts` — only if Better Auth schema compatibility issues are discovered.
- `packages/db/drizzle/*` — only if schema changes require generated Drizzle migrations.

## Technical Details

### Implementation Steps

1. Inspect the final diff for auth-related changes and confirm the feature did not introduce unrelated edits.
2. Check whether any task changed `packages/db/src/schema.ts` or any database model. If yes, run both Drizzle commands from the repo root:

```bash
pnpm db:generate
pnpm db:migrate
```

3. If no schema changes were made, do not create an unnecessary migration. Still confirm that the existing schema includes Better Auth tables: `user`, `session`, `account`, and `verification`.
4. Never run `drizzle push`.
5. Run quality checks from the repo root:

```bash
pnpm lint
pnpm check-types
pnpm build
```

6. If any command fails because environment variables are missing, record the exact missing variable and command output. Do not hide environment-related failures.
7. Confirm key Better Auth runtime settings:
   - `emailAndPassword.enabled` is true.
   - `socialProviders.github.clientId` reads `process.env.GITHUB_CLIENT_ID!`.
   - `socialProviders.github.clientSecret` reads `process.env.GITHUB_CLIENT_SECRET!`.
   - `database` uses `drizzleAdapter(db, { provider: "pg", schema })`.
   - No `disableCSRFCheck` or `disableOriginCheck` was added.
8. Confirm client behavior statically:
   - Login email form calls `authClient.signIn.email`.
   - Login no longer uses fake `setTimeout` loading.
   - Login passes `rememberMe`.
   - Login and signup GitHub buttons call `authClient.signIn.social` with provider `github`.
9. Because this is Better Auth implementation work, request or run a Better Auth-focused review after code changes. Use the `better-auth-expert` subagent if available in the implementation workflow.

### Code Snippets

Expected server shape:

```ts
export const auth = betterAuth({
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

Expected client calls:

```ts
await authClient.signIn.email({
  email,
  password,
  rememberMe,
  callbackURL: "/",
});

await authClient.signIn.social({
  provider: "github",
  callbackURL: "/",
});
```

### Environment Variables

- `DATABASE_URL` — needed by Drizzle and `@repo/db`.
- `BETTER_AUTH_SECRET` — needed by Better Auth runtime.
- `BETTER_AUTH_URL` — needed for correct OAuth callback/origin handling.
- `GITHUB_CLIENT_ID` — needed for GitHub OAuth.
- `GITHUB_CLIENT_SECRET` — needed for GitHub OAuth.

### API Endpoints

- `GET /api/auth/*` and `POST /api/auth/*` should remain handled by `auth.handler` in `apps/tanstack-app/src/routes/api/auth/$.ts`.
- Optional runtime smoke check when the app is running: `GET /api/auth/ok` should return Better Auth's OK response.

## Acceptance Criteria

- [ ] If schema changed, `pnpm db:generate` and `pnpm db:migrate` were run and results documented.
- [ ] `drizzle push` was not used.
- [ ] `pnpm lint` result is documented.
- [ ] `pnpm check-types` result is documented.
- [ ] `pnpm build` result is documented.
- [ ] Better Auth server config and client calls match the expected patterns above.
- [ ] A Better Auth-focused review is completed or explicitly reported as not run.
- [ ] Any failures caused by missing env vars are reported with exact variable names and commands.

## Notes

Browser-level GitHub OAuth success depends on manual GitHub OAuth app callback URL configuration. If static checks pass but browser OAuth cannot be completed due to external credentials or callback settings, report that as a manual verification requirement instead of changing code blindly.
