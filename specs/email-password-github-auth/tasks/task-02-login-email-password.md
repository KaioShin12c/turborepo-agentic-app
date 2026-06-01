# Task 02: Wire Login Email Password Flow

## Status

complete

## Wave

1

## Description

Replace the login page's fake timeout with a real Better Auth email/password sign-in. The app already has a visually complete login form with local Zod validation, React Hook Form, a loading state, and a remember-me checkbox. This task keeps that UI intact while making form submission call `authClient.signIn.email`.

## Dependencies

**Depends on:** None (Wave 1)
**Blocks:** task-04-verify-auth-and-migrations.md

**Context from dependencies:** No prior task is required. Current repo context: `apps/tanstack-app/src/lib/auth-client.ts` exports `authClient` from `better-auth/react`; `apps/tanstack-app/src/lib/auth.ts` already enables `emailAndPassword`; and the existing signup page imports `authClient` from `../lib/auth-client` and calls `authClient.signUp.email` successfully.

## Files to Create

None.

## Files to Modify

- `apps/tanstack-app/src/components/login-page.tsx` — import `authClient`, add auth error state, and call `authClient.signIn.email` from the existing submit handler.

## Technical Details

### Implementation Steps

1. Open `apps/tanstack-app/src/components/login-page.tsx`.
2. Add `import { authClient } from "../lib/auth-client";` alongside the existing local imports.
3. Add local state for auth errors, for example `const [authError, setAuthError] = useState<string | null>(null);`.
4. Change `onSubmit` from a synchronous function to an async function.
5. Keep the existing `loginSchema.safeParse(values)` validation and field-level `setError` handling.
6. After validation succeeds, clear any old auth error, set loading true, and call Better Auth:

```ts
const { error } = await authClient.signIn.email({
  email: result.data.email,
  password: result.data.password,
  rememberMe: result.data.rememberMe,
  callbackURL: "/",
});
```

7. If Better Auth returns an error, display `error.message || "Unable to sign in."` in the page.
8. If the call throws, display a generic connection/auth message.
9. Always clear loading in a `finally` block.
10. Remove the fake `setTimeout(() => setIsLoading(false), 2000)` behavior.
11. Preserve the existing page design, form fields, and shadcn/ui components.
12. Add an auth error alert near the submit button, matching the visual style already used in `signup-page.tsx` for `authError`.

### Code Snippets

Suggested error block style based on `signup-page.tsx`:

```tsx
{authError ? (
  <div
    role="alert"
    className="rounded-2xl border border-red-300/25 bg-red-950/25 px-4 py-3 font-['Avenir_Next','Segoe_UI',sans-serif] text-sm leading-6 text-red-200"
  >
    {authError}
  </div>
) : null}
```

Suggested submit flow:

```ts
const onSubmit = async (values: LoginFormValues) => {
  setAuthError(null);

  const result = loginSchema.safeParse(values);

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const fieldName = issue.path[0];

      if (fieldName === "email" || fieldName === "password") {
        setError(fieldName, { message: issue.message, type: "manual" });
      }
    });
    return;
  }

  setIsLoading(true);
  try {
    const { error } = await authClient.signIn.email({
      email: result.data.email,
      password: result.data.password,
      rememberMe: result.data.rememberMe,
      callbackURL: "/",
    });

    if (error) {
      setAuthError(error.message || "Unable to sign in.");
    }
  } catch {
    setAuthError(
      "Unable to sign in right now. Check your connection and try again.",
    );
  } finally {
    setIsLoading(false);
  }
};
```

### Environment Variables

- `BETTER_AUTH_SECRET` — required by Better Auth at runtime.
- `BETTER_AUTH_URL` — should match the running app origin.
- `DATABASE_URL` — required by the Better Auth Drizzle adapter through `@repo/db`.

### API Endpoints

- `POST /api/auth/sign-in/email` or Better Auth's equivalent email sign-in endpoint is called through `authClient.signIn.email`; do not hardcode `fetch` to this endpoint.

## Acceptance Criteria

- [ ] Login submit handler is async and calls `authClient.signIn.email` after local validation succeeds.
- [ ] The fake timeout login behavior is removed.
- [ ] `rememberMe` from the form is passed to Better Auth.
- [ ] Auth errors are displayed with `role="alert"` and do not overwrite field validation errors.
- [ ] Existing login page layout, typography, colors, and shadcn/ui components remain visually consistent.
- [ ] TypeScript types remain valid without `any` casts.

## Notes

Better Auth client methods must be called from the client side. This task only changes the React login page component, not server routes.
