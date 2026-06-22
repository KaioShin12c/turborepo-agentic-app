# Task 03: Update Authenticated Layout

## Status

pending

## Wave

3

## Description

Update the authenticated layout (`_authenticated/route.tsx`) to use shadcn's `SidebarProvider` and the new `AppSidebar` component. Remove the local `sidebarOpen`/`mobileNavOpen` useState for the sidebar (mobile nav state stays). Wire the sidebar trigger button into the `TopBar` so the mobile hamburger button toggles the shadcn sidebar instead of opening the mobile nav.

The authenticated layout is the root route for all authenticated pages. It currently:
1. Auth guards with `beforeLoad` — no change needed
2. Manages `sidebarOpen` state for desktop sidebar — **remove, replaced by SidebarProvider**
3. Manages `mobileNavOpen` state for mobile Sheet — **keep unchanged**
4. Passes `sidebarOpen`/`onToggle` to `<Sidebar>` — **change to render `<AppSidebar>` with no state props**
5. Wraps content in `<div className="flex h-screen...">` — **keep, but ensure it's inside SidebarProvider**

## Dependencies

**Depends on:** task-02-app-sidebar.md (the layout imports `AppSidebar` instead of the old `Sidebar`)
**Blocks:** Nothing

**Context from dependencies:**
- `AppSidebar` is a new export from `shared/components/sidebar.tsx` that expects to be rendered inside a `SidebarProvider`
- `AppSidebar` takes `currentPath` and optional `className` props (no more `sidebarOpen`/`onToggle`)
- The shadcn `SidebarProvider` and `SidebarInset` are available from `@repo/ui/components/ui/sidebar`
- `SidebarTrigger` is available from the same package

## Files to Modify

- `apps/tanstack-app/src/routes/_authenticated/route.tsx` — Update layout component

## Files to Create

None.

## Technical Details

### Target Implementation

```tsx
import { authClient } from "@repo/auth/client";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/ui/sidebar";
import { createFileRoute, Outlet, redirect, useRouter, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { getCurrentSession } from "../../features/auth/auth.functions";
import { AppSidebar } from "../../shared/components/sidebar";
import { MobileNav } from "../../shared/components/mobile-nav";
import { TopBar } from "../../shared/components/top-bar";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const session = await getCurrentSession();
    if (!session) {
      throw redirect({ to: "/login" });
    }
    return { session };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { session } = Route.useRouteContext();
  const router = useRouter();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setSignOutError(null);
    try {
      const { error } = await authClient.signOut({
        fetchOptions: { onSuccess: () => router.navigate({ to: "/login" }) },
      });
      if (error) setSignOutError(error.message || "Unable to sign out.");
    } catch {
      setSignOutError("Unable to sign out right now.");
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar
        currentPath={currentPath}
        className="hidden lg:flex"
      />

      <MobileNav
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        currentPath={currentPath}
        userName={session?.user?.name}
        userEmail={session?.user?.email}
        userImage={session?.user?.image || ""}
        onSignOut={handleSignOut}
      />

      <SidebarInset>
        <TopBar
          session={session}
          onSignOut={handleSignOut}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {signOutError && (
            <div
              role="alert"
              className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {signOutError}
            </div>
          )}
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

### Key Changes from Current

| Before | After |
|--------|-------|
| `<div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">` | `SidebarProvider` wrapper |
| `<Sidebar sidebarOpen={...} onToggle={...} .../>` | `<AppSidebar currentPath={currentPath} .../>` |
| `<main>` | `<SidebarInset>` |
| `useState<boolean>(true)` for sidebarOpen | Removed |
| `useState<boolean>(false)` for mobileNavOpen | Kept (unchanged) |

### Important Details

1. **SidebarProvider placement**: Must wrap both `AppSidebar` and the main content (`SidebarInset`). The `SidebarProvider` establishes context used by `Sidebar`, `SidebarTrigger`, and `useSidebar()`.

2. **SidebarInset**: Replaces the `<main>` wrapper. `SidebarInset` registers as the sidebar's peer element, allowing the sidebar's layout gap and width calculations to work correctly. It provides `flex w-full flex-1 flex-col bg-background` by default.

3. **`defaultOpen={true}`**: The sidebar starts expanded by default (matching current behavior where `sidebarOpen` initializes to `true`).

4. **`className="hidden lg:flex"` on AppSidebar**: The shadcn sidebar's `Sidebar` component already handles responsive hiding via `hidden md:block`. But the current code uses `lg:flex` for desktop-only display. Passing `className="hidden lg:flex"` to `AppSidebar` overrides the default behavior. Wait — the shadcn `Sidebar` component renders `className="group peer hidden md:block"` on its wrapper. If we pass `className="hidden lg:flex"`, it will be merged via `cn()`. But `hidden` and `flex` conflict.

   **Better approach**: In the shadcn sidebar, `Sidebar` handles responsive logic internally. The mobile version uses a `Sheet` when `isMobile` is true. The desktop version occurs when `!isMobile` (≥768px by default). If the current design expects sidebar at ≥1024px (lg breakpoint), we need to handle this at the `SidebarProvider` level or via the `isMobile` detection.

   **Decision**: Since the mobile detection in shadcn's `useIsMobile` checks for `<768px`, and the current design shows the sidebar at ≥1024px, we should keep the `className="hidden lg:flex"` on `AppSidebar` to hide it at tablet sizes (768-1023px). The `hidden` class won't conflict because `AppSidebar`'s className is passed to the `Sidebar` component's root div which gets `cn("group peer hidden md:block", className)`.

   Wait — `cn("hidden md:block", "hidden lg:flex")` = `"hidden lg:flex"` (tailwind-merge resolves: hidden vs flex, keeps flex; md:block vs lg:flex, keeps lg:flex). Since `cn()` uses tailwind-merge, the result should be correct: hidden by default, flex at lg breakpoint.

   **Let me verify**: `hidden` (always hidden), `md:block` (block at md+), then overridden by `hidden` again and `lg:flex` (flex at lg+). tailwind-merge would keep the lg variant... Actually `cn("hidden md:block", "hidden lg:flex")` would be `hidden lg:flex` because `hidden lg:flex` overrides `hidden md:block` — tailwind-merge resolves conflicting utilities. So the final result: hidden by default, flex at lg breakpoint. Correct.

5. **Mobile nav stays separate**: The shadcn sidebar has built-in mobile support (renders a Sheet when `isMobile`). We explicitly DO NOT use it because the existing `MobileNav` component provides a richer mobile experience (user profile dropdown, separate layout). The `isMobile` check in shadcn is at 768px, but the current sidebar design shows at 1024px. By keeping `className="hidden lg:flex"` on AppSidebar, the shadcn sidebar's mobile code path never activates.

6. **TopBar's mobile nav button**: The TopBar already has a mobile hamburger button that calls `onOpenMobileNav`. This continues to work — it opens the `MobileNav` Sheet (unchanged behavior). If we want the TopBar to also have a `SidebarTrigger`, we could add it, but that's NOT in scope for this refactor.

7. **`SidebarInset` vs `<main className="flex min-w-0 flex-1 flex-col overflow-hidden">`**: `SidebarInset` renders `<main data-slot="sidebar-inset">` with default classes `flex w-full flex-1 flex-col bg-background`. The current `<main>` has `flex min-w-0 flex-1 flex-col overflow-hidden`. We need:
   - `min-w-0` — pass via className
   - `overflow-hidden` — pass via className
   - `flex` — default from SidebarInset
   - `flex-1` — default from SidebarInset
   - `w-full` — default from SidebarInset
   - `bg-background` — default from SidebarInset

   ```tsx
   <SidebarInset className="min-w-0 overflow-hidden">
   ```

8. **Remove `bg-background font-sans text-foreground` from the outer div**: These were on the old `<div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">`. With `SidebarProvider`, the font-sans and text-foreground settings should move to the body or root level (already set in `global.css`). The `h-screen overflow-hidden` is handled by `SidebarProvider`'s internal wrapper which uses `min-h-svh`.

9. **Import cleanup**: Remove unused imports from the old `Sidebar` component.

### Complete Diff Summary

The file `apps/tanstack-app/src/routes/_authenticated/route.tsx` changes as follows:

1. **Update imports**:
   - ADD: `import { SidebarInset, SidebarProvider } from "@repo/ui/components/ui/sidebar";`
   - CHANGE: `import { Sidebar } from "../../shared/components/sidebar";` → `import { AppSidebar } from "../../shared/components/sidebar";`
   - REMOVE: nothing (other imports stay)

2. **Remove local `sidebarOpen` state**:
   - DELETE: `const [sidebarOpen, setSidebarOpen] = useState(true);`

3. **Wrap with SidebarProvider**:
   - REPLACE: `<div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">` → `<SidebarProvider defaultOpen={true}>`

4. **Update Sidebar usage**:
   - REPLACE: `<Sidebar sidebarOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} currentPath={currentPath} className="hidden lg:flex" />`
   - WITH: `<AppSidebar currentPath={currentPath} className="hidden lg:flex" />`

5. **Replace main wrapper**:
   - REPLACE: `<main className="flex min-w-0 flex-1 flex-col overflow-hidden">` → `<SidebarInset className="min-w-0 overflow-hidden">`
   - REPLACE: `</main>` → `</SidebarInset>`

6. **Close the provider**:
   - REPLACE: `</div>` (closing the old flex container) → `</SidebarProvider>`

## Acceptance Criteria

- [ ] `SidebarProvider` wraps the entire layout (sidebar + content)
- [ ] `AppSidebar` renders instead of old `Sidebar` component
- [ ] No more `sidebarOpen`/`setSidebarOpen` local state
- [ ] `mobileNavOpen` state and `MobileNav` component remain unchanged
- [ ] `SidebarInset` replaces the old `<main>` wrapper with `min-w-0 overflow-hidden` classes
- [ ] Auth guard (`beforeLoad`) works unchanged
- [ ] Sign out flow works unchanged (error alert renders correctly)
- [ ] `TopBar` renders with all props unchanged
- [ ] Mobile nav button in TopBar still opens MobileNav Sheet
- [ ] Sidebar collapses/expands via the toggle button in the sidebar footer
- [ ] Sidebar is hidden at viewports below 1024px (lg), visible at ≥1024px
- [ ] No TypeScript errors
- [ ] No runtime errors (layout renders without crashing)
- [ ] No comments in the modified file

## Notes

- The `SidebarProvider` sets up the `SidebarContext` that `AppSidebar`, `SidebarTrigger`, and components using `useSidebar()` all consume.
- The `defaultOpen={true}` prop ensures the sidebar starts expanded.
- `MobileNav` is intentionally left untouched — it uses its own `Sheet` and is not part of this refactor.
- The `SidebarProvider` internally includes `TooltipProvider`, so tooltips in `AppSidebar` (via `SidebarMenuButton`) work automatically.
