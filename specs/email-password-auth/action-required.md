# Action Required: Email Password Auth

Manual steps that must be completed by a human. These cannot be automated safely because they involve secrets or environment-specific database access.

## Before Implementation

- [ ] **Confirm local database access** — `DATABASE_URL` must point to a reachable PostgreSQL database for migration generation/application checks.
- [ ] **Prepare Better Auth env vars** — add `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` to the app environment. Generate a secret with `pnpm dlx auth@latest secret` or `openssl rand -base64 32`; use `http://localhost:3000` for local `BETTER_AUTH_URL`.

## During Implementation

- [ ] **Approve migration execution if prompted** — Drizzle `migrate` applies SQL to the configured database and may require the database to be running.

## After Implementation

- [ ] **Create a real test account locally** — start the app, visit `/signup`, and register with a test email/password to confirm the full browser flow.

---

> These tasks are also referenced in context within the relevant task files.
