# Requirements: Email Password GitHub Auth

## Summary

The app already has a Better Auth foundation for email/password signup: `apps/tanstack-app/src/lib/auth.ts` uses `better-auth`, `@better-auth/drizzle-adapter`, and `@repo/db`; `apps/tanstack-app/src/routes/api/auth/$.ts` forwards `GET` and `POST` requests to `auth.handler`; `packages/db/src/schema.ts` contains Better Auth-compatible `user`, `session`, `account`, and `verification` tables; and `apps/tanstack-app/src/components/signup-page.tsx` calls `authClient.signUp.email`.

This feature completes the requested authentication flow by adding real login with email/password and GitHub OAuth. The login page currently validates locally and uses a fake timeout, while its GitHub button has no behavior. The Better Auth server must be configured with the GitHub social provider using the existing `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` environment variables, and the client UI must call Better Auth methods for both credential and GitHub sign-in.

Database changes should remain compatible with Drizzle ORM and Better Auth. If the implementation changes any database schema, the repo rules require running Drizzle generation and migration commands, never `drizzle push`.

## Goals

- Enable email/password signup using the existing Better Auth signup implementation.
- Enable email/password login from the existing login page using `authClient.signIn.email`.
- Enable GitHub OAuth login and signup entry points using Better Auth's `socialProviders.github` server config and `authClient.signIn.social` client call.
- Preserve the existing visual design and validation behavior of the login and signup pages.
- Surface useful loading, validation, and authentication error states to users.
- Verify the final auth implementation with lint, typecheck, build, and database migration commands when relevant.

## Non-Goals

- No password reset flow, despite the existing `Forgot password?` link.
- No email verification requirement or email delivery setup.
- No protected dashboard, authenticated home page, or route guard implementation.
- No session profile menu or sign-out UI.
- No additional OAuth providers besides GitHub.
- No standalone testing task files unless the implementer chooses to add tests inside an implementation task.

## Acceptance Criteria

- [ ] `apps/tanstack-app/src/lib/auth.ts` enables `emailAndPassword` and configures `socialProviders.github` with `process.env.GITHUB_CLIENT_ID!` and `process.env.GITHUB_CLIENT_SECRET!`.
- [ ] The Better Auth API route remains available under `/api/auth/*` and supports the OAuth redirect/callback flow.
- [ ] `apps/tanstack-app/src/components/login-page.tsx` calls `authClient.signIn.email` after local validation succeeds and no longer uses a fake `setTimeout` login.
- [ ] Login form passes `email`, `password`, and `rememberMe` to Better Auth and shows auth errors in the existing visual style.
- [ ] The GitHub buttons on login and signup call `authClient.signIn.social({ provider: "github", callbackURL: "/" })` or an equivalent callback URL chosen consistently for this app.
- [ ] Signup page keeps the existing `authClient.signUp.email` flow and gains a working GitHub sign-in/sign-up entry point.
- [ ] Existing shadcn/ui components from `@repo/ui` remain the primary UI primitives; custom UI is limited to composition in existing page components.
- [ ] If schema changes are made, `pnpm db:generate` and `pnpm db:migrate` are run; `drizzle push` is not used.
- [ ] Final verification includes `pnpm lint`, `pnpm check-types`, and `pnpm build`, or reports concrete failures and causes.

## Assumptions

- The app package is `apps/tanstack-app` and uses TanStack Start/Vite with file routes under `src/routes`.
- The database package is `packages/db`, exports `db` and schema from `src/index.ts`, and uses PostgreSQL through Drizzle ORM and `postgres`.
- `better-auth` and `@better-auth/drizzle-adapter` are already installed in `apps/tanstack-app/package.json`.
- Better Auth tables already exist in `packages/db/src/schema.ts`: `user`, `session`, `account`, and `verification`.
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` already exist in the environment, as stated by the user.
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `DATABASE_URL` may still be needed for local runtime verification even though GitHub credentials already exist.
- The default post-login callback can be `/` unless the implementer finds an existing dashboard route.

## Technical Constraints

- Use Better Auth docs and current API patterns. Relevant confirmed docs: `/docs/basic-usage#social-sign-on` for `socialProviders.github` and `authClient.signIn.social`.
- Keep `drizzleAdapter(db, { provider: "pg", schema })` in the Better Auth config.
- Do not set `disableCSRFCheck` or `disableOriginCheck`.
- Do not use `drizzle push`.
- Existing repo rule: for ID columns not related to Better Auth, use UUID. Better Auth tables may use Better Auth's expected string IDs.
- After any Better Auth implementation changes, run or request a Better Auth-focused review before considering the feature complete.
