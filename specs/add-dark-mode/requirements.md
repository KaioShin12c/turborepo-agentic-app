# Requirements: Add Dark Mode

## Summary

The TanStack Start app already has shadcn/ui CSS variables for both `:root` and `.dark` themes in `packages/ui/src/styles/global.css`, plus Tailwind's `@custom-variant dark (&:is(.dark *));`. However, the app currently has only a static visual theme button in `apps/tanstack-app/src/routes/__root.tsx`; it does not persist a user preference, apply the `.dark`/`.light` class to the document, or provide a real light/dark/system selector.

This feature implements dark mode using the official shadcn/ui TanStack Start pattern from `https://ui.shadcn.com/docs/dark-mode/tanstack-start`. The app will use a `ThemeProvider` with `ScriptOnce` from `@tanstack/react-router` to apply the resolved theme before React hydrates, minimizing flash of incorrect theme and avoiding hydration warnings.

The user should be able to choose `Light`, `Dark`, or `System` from an accessible dropdown toggle. The chosen mode is stored in `localStorage` under `theme`, and `system` mode tracks `prefers-color-scheme` changes while the app is open.

## Goals

- Implement a TanStack Start-compatible `ThemeProvider` that supports `light`, `dark`, and `system` themes.
- Persist the selected theme in `localStorage` using the storage key `theme`.
- Apply the resolved theme class to `document.documentElement` and keep `colorScheme` in sync.
- Wrap the root shell with the provider and add `suppressHydrationWarning` to the `<html>` element.
- Replace the current static theme button with a functional shadcn-style dropdown mode toggle.
- Use existing shadcn/ui design tokens and shared UI package components; do not use inline styles or hardcoded colors.

## Non-Goals

- Do not redesign the app pages beyond replacing the existing root theme button with a functional toggle.
- Do not change the existing shadcn color palette or CSS variable values in `packages/ui/src/styles/global.css`.
- Do not add database persistence for theme preference.
- Do not add authentication-specific user settings for theme preference.
- Do not add separate unit/e2e testing tasks; implementation tasks should still run existing quality checks.

## Acceptance Criteria

- [ ] On first load with no saved preference, the app uses `system` as the default theme.
- [ ] Selecting `Light`, `Dark`, or `System` updates the document theme immediately.
- [ ] The selected theme is persisted in `localStorage` under `theme`.
- [ ] The `<html>` element uses `suppressHydrationWarning` because pre-hydration script mutates theme classes.
- [ ] Theme is applied before hydration via `ScriptOnce` to reduce flash of incorrect theme.
- [ ] Existing `dark:` Tailwind classes and `.dark` CSS variables work through the document root class.
- [ ] The mode toggle is accessible, keyboard-operable, and has an `sr-only` label.
- [ ] `pnpm check-types` and `pnpm build` pass after implementation.

## Assumptions

- The target app is `apps/tanstack-app`, a TanStack Start/TanStack Router app.
- The shared UI package is `packages/ui`, exported as `@repo/ui`.
- Imports in `apps/tanstack-app` can use the configured import alias `#/*` for `./src/*`.
- `lucide-react` is already available in `apps/tanstack-app` and `packages/ui`.
- shadcn's dropdown-menu component is not currently present in `packages/ui/src/components/ui/dropdown-menu.tsx` and must be added before using a dropdown toggle.
- Existing root devtools in `apps/tanstack-app/src/routes/__root.tsx` should remain intact.

## Technical Constraints

- Follow the shadcn/ui TanStack Start dark mode docs: use `ScriptOnce` from `@tanstack/react-router` in the provider.
- Theme values must be exactly `"dark" | "light" | "system"`.
- The default theme should be `system`, and the storage key should be `theme`.
- The provider must be client-safe: all direct `localStorage`, `window`, `document`, and `matchMedia` usage must occur inside the pre-hydration script string or React effects/callbacks that run in the browser.
- Do not modify `packages/ui/src/styles/global.css`; it already defines `:root`, `.dark`, and the `dark` variant.
- Avoid overlapping file edits within the same implementation wave.
