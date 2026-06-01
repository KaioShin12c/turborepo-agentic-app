# Requirements: Email Password Auth

## Summary

The app already has a polished signup page at `apps/tanstack-app/src/components/signup-page.tsx`, but submitting the form only runs local validation and a fake `setTimeout` loading state. This feature replaces the placeholder behavior with real Better Auth email/password registration backed by the existing Drizzle/PostgreSQL database package.

The implementation must add Better Auth core schema support, configure the Better Auth server using the Drizzle adapter, expose the Better Auth API under the app's auth route, and create a typed client helper for React. The signup form should keep the existing design and validation UX while calling Better Auth to create users with `name`, `email`, and `password`.

Because this repository has explicit database rules, schema changes must use Drizzle migration generation and migration commands. Do not use `drizzle push`. For Better Auth with Drizzle, Better Auth's direct `migrate` command is not the right migration path; use Better Auth schema generation or manual schema updates plus `drizzle-kit generate` and `drizzle-kit migrate`.

## Goals

- Enable email/password account creation using Better Auth.
- Store Better Auth users, sessions, accounts, and verification records in PostgreSQL through Drizzle ORM.
- Preserve the existing signup page visual design and client-side validation.
- Add server and client auth modules that follow Better Auth best practices.
- Add or document the required migration command so database changes can be applied without `drizzle push`.

## Non-Goals

- No OAuth/social login providers.
- No password reset email flow.
- No email verification requirement unless added later.
- No protected dashboard or route guard implementation.
- No new test-only task files; verification belongs in the implementation/review flow.

## Acceptance Criteria

- [ ] The repo includes Better Auth and the Drizzle adapter dependencies in the correct workspace package(s).
- [ ] The Drizzle schema defines Better Auth-compatible `user`, `session`, `account`, and `verification` tables or equivalent mappings accepted by the Drizzle adapter.
- [ ] The Better Auth server config enables `emailAndPassword` and uses the existing `@repo/db` Drizzle connection.
- [ ] The TanStack app exposes a catch-all Better Auth API route under `/api/auth/*`.
- [ ] The React signup page calls `authClient.signUp.email` with `name`, `email`, and `password` after local validation succeeds.
- [ ] Signup loading, duplicate email/auth errors, and success behavior are visible to the user.
- [ ] Migration generation is run with Drizzle tooling and no `drizzle push` command is used.
- [ ] `pnpm lint`, `pnpm check-types`, and `pnpm build` are run after implementation, or any failures are reported with concrete details.

## Assumptions

- The app package is `apps/tanstack-app` and uses TanStack Start/Vite with file routes under `src/routes`.
- The database package is `packages/db`, exports `db` from `src/index.ts`, and uses PostgreSQL through `postgres` and `drizzle-orm/postgres-js`.
- The existing `DATABASE_URL` environment variable remains the DB connection source.
- Users may need to provide `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` in their local environment before runtime verification.
- The desired signup success behavior is to show a success message and link/redirect path to `/login`; automatic sign-in can be added later if desired.

## Technical Constraints

- Use Better Auth docs and current API patterns. Relevant docs confirmed during planning: Drizzle adapter at `/docs/adapters/drizzle`, CLI generate at `/docs/concepts/cli#generate`, and database schema generation at `/docs/concepts/database#generating-schema`.
- Install the Drizzle adapter package as `@better-auth/drizzle-adapter` and core package as `better-auth`.
- Use `drizzleAdapter(db, { provider: "pg", schema })` for PostgreSQL.
- Better Auth environment variables: `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`.
- Do not set `disableCSRFCheck` or `disableOriginCheck`.
- Do not use `drizzle push`; add/use `drizzle-kit migrate` instead.
- Existing repo rule: for ID columns not related to Better Auth, use UUID. Better Auth tables may use Better Auth's expected string IDs.
