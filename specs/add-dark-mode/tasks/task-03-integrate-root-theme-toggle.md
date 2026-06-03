# Task 03: Integrate Root Theme Toggle

## Status

complete

## Wave

2

## Description

Wire dark mode into the TanStack Start root shell and replace the current static theme button with a functional mode toggle. This completes the user-facing feature by wrapping all routes in the `ThemeProvider`, adding `suppressHydrationWarning` to the root `<html>`, and rendering an accessible dropdown with `Light`, `Dark`, and `System` choices.

## Dependencies

**Depends on:** task-01-create-theme-provider.md, task-02-add-dropdown-menu-ui.md
**Blocks:** None

**Context from dependencies:** Task 01 creates `apps/tanstack-app/src/components/theme-provider.tsx`, exporting `ThemeProvider` and `useTheme`. The provider persists the selected theme in `localStorage` under `theme`, resolves `system`, applies the root `.light`/`.dark` class, and injects a pre-hydration script with `ScriptOnce`. Task 02 creates `packages/ui/src/components/ui/dropdown-menu.tsx`, exporting dropdown primitives from `@repo/ui/components/ui/dropdown-menu` for the toggle menu.

## Files to Create

- `apps/tanstack-app/src/components/mode-toggle.tsx` — Functional shadcn-style mode toggle that uses `useTheme` and shared dropdown primitives.

## Files to Modify

- `apps/tanstack-app/src/routes/__root.tsx` — Import and wrap the root shell in `ThemeProvider`, add `suppressHydrationWarning`, remove the static theme button, and render the functional `ModeToggle`.

## Technical Details

### Implementation Steps

1. Create `apps/tanstack-app/src/components/mode-toggle.tsx`.
2. Implement `ModeToggle` using `Moon` and `Sun` from `lucide-react`, `Button` from `@repo/ui/components/ui/button`, dropdown primitives from `@repo/ui/components/ui/dropdown-menu`, and `useTheme` from `./theme-provider`.
3. The toggle should call `setTheme('light')`, `setTheme('dark')`, and `setTheme('system')` from dropdown items.
4. Preserve accessibility with a real button trigger, `asChild`, and `<span className="sr-only">Toggle theme</span>`.
5. Use existing shadcn semantic classes and design tokens. Do not use inline styles. Do not hardcode colors.
6. Modify `apps/tanstack-app/src/routes/__root.tsx`:
   - Remove direct imports of `Moon`, `Sun`, and `Button`; they were only used by the static theme button.
   - Import `ThemeProvider` from `../components/theme-provider`.
   - Import `ModeToggle` from `../components/mode-toggle`.
   - Add `suppressHydrationWarning` to `<html lang="en">` because the pre-hydration theme script mutates classes/styles before React hydrates.
   - Wrap the route content with `<ThemeProvider defaultTheme="system" storageKey="theme">`.
   - Replace the existing static `<Button aria-label="Switch color theme">...</Button>` block with a positioned container rendering `<ModeToggle />`.
   - Keep `<TanStackDevtools />` and `<Scripts />` intact.
7. Run the project quality checks after implementation.

### Code Snippets

Expected `ModeToggle` shape:

```tsx
import { Moon, Sun } from 'lucide-react'

import { Button } from '@repo/ui/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu'

import { useTheme } from './theme-provider'

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" type="button">
          <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

Current `apps/tanstack-app/src/routes/__root.tsx` has this static button to replace:

```tsx
<Button
  type="button"
  variant="outline"
  aria-label="Switch color theme"
  className="fixed right-4 top-4 z-50 h-11 rounded-full border-border/60 bg-card/75 px-3 font-mono text-[10px] uppercase tracking-widest text-card-foreground shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary/70 sm:right-6 sm:top-6"
>
  <span className="flex size-7 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
    <Sun className="size-3.5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
    <Moon className="absolute size-3.5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
  </span>
  <span>Theme</span>
</Button>
```

Expected root shell shape after integration:

```tsx
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
            <ModeToggle />
          </div>
          {children}
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
```

The exact placement of `TanStackDevtools` may remain inside the provider as shown. Keep `Scripts` after the provider, matching the shadcn docs' root structure.

### Environment Variables

None.

### API Endpoints

None.

### Verification Commands

Run from the repository root:

```bash
pnpm check-types
pnpm build
```

## Acceptance Criteria

- [ ] `apps/tanstack-app/src/components/mode-toggle.tsx` exists and exports `ModeToggle`.
- [ ] `ModeToggle` uses `useTheme` and offers `Light`, `Dark`, and `System` dropdown items.
- [ ] `ModeToggle` imports dropdown primitives from `@repo/ui/components/ui/dropdown-menu`.
- [ ] `apps/tanstack-app/src/routes/__root.tsx` imports `ThemeProvider` and wraps rendered app content with `<ThemeProvider defaultTheme="system" storageKey="theme">`.
- [ ] `<html>` in `RootDocument` has `suppressHydrationWarning`.
- [ ] The old static theme button is removed and replaced with the functional `ModeToggle`.
- [ ] `HeadContent`, `TanStackDevtools`, and `Scripts` behavior remains intact.
- [ ] Selecting each theme updates the root class and persists `localStorage.theme`.
- [ ] `pnpm check-types` and `pnpm build` pass after implementation.

## Notes

The current app root imports `Moon`, `Sun`, and `Button` only for the static button. After replacing the button, those imports should be removed from `__root.tsx` to avoid unused imports.
