# Action Required: Email Password GitHub Auth

Manual steps that must be completed by a human. These cannot be automated.

## Before Implementation

- [ ] **Confirm `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are available to `apps/tanstack-app` at runtime** — the user stated they already exist, but the app process must receive them when running locally and in deployment.
- [ ] **Confirm `BETTER_AUTH_SECRET` is configured** — Better Auth needs a stable secret for secure cookies/tokens. Generate one with `openssl rand -base64 32` if missing.
- [ ] **Confirm `BETTER_AUTH_URL` is configured** — use `http://localhost:3000` for local development and the production URL in deployment.
- [ ] **Confirm the GitHub OAuth app callback URL** — the GitHub OAuth app must allow the Better Auth callback URL for this app, typically `${BETTER_AUTH_URL}/api/auth/callback/github`.

## During Implementation

- [ ] **Provide `DATABASE_URL` if migrations or runtime verification are run locally** — Drizzle config and the DB package throw when `DATABASE_URL` is missing.

## After Implementation

- [ ] **Test GitHub OAuth in a browser** — OAuth redirects require real GitHub credentials and callback URL configuration, which cannot be fully verified by static checks alone.

---

> These tasks are also referenced in context within the relevant task files.
