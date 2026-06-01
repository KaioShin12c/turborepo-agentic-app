# Task 03: Wire GitHub Auth Buttons

## Status

complete

## Wave

2

## Description

Connect the existing GitHub buttons on the login and signup experiences to Better Auth's social sign-in flow. The login page already renders a `Continue with GitHub` button with GitHub icon styling, but it has no click behavior. The signup page currently has no GitHub button, so this task adds one in the same design language and calls the same Better Auth social API.

## Dependencies

**Depends on:** task-01-server-github-provider.md
**Blocks:** task-04-verify-auth-and-migrations.md

**Context from dependencies:** Task 01 configures `apps/tanstack-app/src/lib/auth.ts` with `socialProviders.github` using `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`. With that server configuration in place, client components can call `authClient.signIn.social({ provider: "github", callbackURL: "/" })`; Better Auth will redirect the browser to GitHub and complete the callback through the existing `/api/auth/*` handler.

## Files to Create

None.

## Files to Modify

- `apps/tanstack-app/src/components/login-page.tsx` — add GitHub button loading/error behavior and call `authClient.signIn.social` from the existing GitHub button.
- `apps/tanstack-app/src/components/signup-page.tsx` — add a GitHub button and call `authClient.signIn.social` while preserving the existing email signup flow.

## Technical Details

### Implementation Steps

1. Ensure both page components import `authClient` from `../lib/auth-client`. `signup-page.tsx` already does this.
2. In `login-page.tsx`, add a separate loading state for GitHub if needed, for example `isGithubLoading`, so email form loading and OAuth redirect loading do not conflict.
3. In `signup-page.tsx`, add a separate loading state for GitHub if needed and reuse the existing `authError` state for social sign-in failures.
4. Add a helper in each component, for example `handleGithubSignIn`, that clears old auth errors, sets GitHub loading, and calls:

```ts
const { error } = await authClient.signIn.social({
  provider: "github",
  callbackURL: "/",
});
```

5. If Better Auth returns an error, show `error.message || "Unable to continue with GitHub."`.
6. If the call throws, show a generic connection/auth error.
7. Keep loading true until redirect where appropriate, but clear it in `finally` if the client remains on the page because of an error.
8. Disable the GitHub button while its own loading state is true. Also consider disabling it while email auth is loading to prevent double submission.
9. Preserve the login page's existing GitHub button placement above the separator.
10. Add a GitHub button to `signup-page.tsx` near the top of `CardContent`, before the account details separator, matching the login page's button style.
11. Do not manually build GitHub OAuth URLs or call `fetch`; use Better Auth client APIs.

### Code Snippets

Use this client API pattern from Better Auth docs:

```ts
await authClient.signIn.social({
  provider: "github",
  callbackURL: "/",
});
```

Suggested GitHub loading button contents:

```tsx
{isGithubLoading ? (
  <>
    <Loader2 className="animate-spin" data-icon="inline-start" />
    Connecting GitHub
  </>
) : (
  <>
    <svg aria-hidden="true" className="size-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.38 9.38 0 0 1 12 6.98c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.04 10.04 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
    Continue with GitHub
  </>
)}
```

### Environment Variables

- `GITHUB_CLIENT_ID` — required by the server config from Task 01.
- `GITHUB_CLIENT_SECRET` — required by the server config from Task 01.
- `BETTER_AUTH_URL` — must match the callback URL registered in GitHub.

### API Endpoints

- Client code calls Better Auth through `authClient.signIn.social`; do not hardcode endpoint paths.
- Better Auth handles GitHub OAuth redirect and callback through `/api/auth/*`.

## Acceptance Criteria

- [ ] Login page's existing GitHub button calls `authClient.signIn.social` with provider `github`.
- [ ] Signup page includes a GitHub auth button in the existing card design and calls the same Better Auth social API.
- [ ] GitHub loading state is visible and prevents duplicate clicks.
- [ ] GitHub errors are surfaced through the page's auth error UI.
- [ ] Existing email/password login and signup flows remain intact.
- [ ] No hand-written OAuth URL construction or raw OAuth `fetch` calls are added.

## Notes

OAuth redirects may leave the page before `finally` runs in a user-visible way. The loading/error handling still matters when Better Auth returns an immediate configuration error or the redirect is blocked.
