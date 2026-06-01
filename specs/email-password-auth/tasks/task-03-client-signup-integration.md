# Task 03: Wire Signup Form to Better Auth Client

## Status

complete

## Wave

3

## Description

Replace the signup page's fake loading behavior with a real Better Auth client call. The existing UI, visual design, and Zod/react-hook-form validation should remain intact. On valid submission, the form should call `authClient.signUp.email` with the user's name, email, and password, then show a clear success or error state.

## Dependencies

**Depends on:** task-02-server-auth-config-and-handler.md
**Blocks:** task-04-migrations-and-verification.md

**Context from dependencies:** Task 02 creates the Better Auth server config and `/api/auth/*` handler. This task creates a browser client configured for that endpoint and uses Better Auth's `signUp.email` API from the existing signup route.

## Files to Create

- `apps/tanstack-app/src/lib/auth-client.ts` — Better Auth React client helper.

## Files to Modify

- `apps/tanstack-app/src/components/signup-page.tsx` — replace fake submit behavior with Better Auth signup call and user-facing result states.

## Technical Details

### Implementation Steps

1. Create `apps/tanstack-app/src/lib/auth-client.ts` using Better Auth's React client.
2. Export `authClient` and useful methods/hooks as appropriate. Keep the file small.
3. Modify `SignupPage` so `onSubmit` is async and calls Better Auth only after `signupSchema.safeParse(values)` succeeds.
4. Send `name: result.data.fullName`, `email: result.data.email`, and `password: result.data.password` to Better Auth.
5. Preserve the existing accepted terms local validation; Better Auth does not need to store terms acceptance in this feature.
6. Replace `setTimeout(() => setIsLoading(false), 2000)` with real request handling.
7. Add a general auth error message area for failures such as duplicate email or invalid request.
8. Add a success message after signup. Preferred behavior for this spec: show a success message telling the user the account was created and provide the existing link/path to `/login`. Do not implement automatic sign-in unless Better Auth does so by default and it integrates naturally.
9. Ensure the submit button remains disabled while loading and errors are accessible with readable text.

### Code Snippets

Client helper shape:

```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
});
```

Signup call shape:

```ts
const { error } = await authClient.signUp.email({
  name: result.data.fullName,
  email: result.data.email,
  password: result.data.password,
});

if (error) {
  setAuthError(error.message || "Unable to create account.");
  return;
}

setSignupComplete(true);
```

The exact Better Auth client return shape may differ slightly by installed version. Inspect types from `better-auth/react` and adjust while preserving the behavior: call `signUp.email`, handle failure, and show success.

### Environment Variables

- `BETTER_AUTH_URL` — used by the server. The browser client can use same-origin requests; only set explicit `baseURL` if needed.

### API Endpoints

- `POST /api/auth/sign-up/email` or the Better Auth version-specific equivalent used internally by `authClient.signUp.email`.

## Acceptance Criteria

- [ ] `apps/tanstack-app/src/lib/auth-client.ts` exports a Better Auth React client.
- [ ] `SignupPage` no longer uses fake `setTimeout` submission behavior.
- [ ] Valid form submission calls `authClient.signUp.email` with full name as `name`, email, and password.
- [ ] Client-side Zod validation and accepted-terms validation continue to work.
- [ ] Auth failures display a visible user-facing error message.
- [ ] Successful signup displays a visible success state and a path for the user to continue to login.
- [ ] Existing responsive visual design and shadcn/ui component usage are preserved.

## Notes

This task should not add email verification, password reset, login wiring, or protected routes. Keep scope focused on registration from the existing signup page.
