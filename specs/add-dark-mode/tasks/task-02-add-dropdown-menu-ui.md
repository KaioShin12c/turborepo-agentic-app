# Task 02: Add Dropdown Menu UI

## Status

complete

## Wave

1

## Description

Add the shared shadcn/ui dropdown-menu primitives to `packages/ui` so the app can render a proper theme mode selector. The existing project has shared shadcn components under `packages/ui/src/components/ui`, but `dropdown-menu.tsx` is currently missing.

## Dependencies

**Depends on:** None (Wave 1)
**Blocks:** task-03-integrate-root-theme-toggle.md

**Context from dependencies:** This is a Wave 1 foundational task and has no prior task outputs. The root integration task will import dropdown primitives from `@repo/ui/components/ui/dropdown-menu` after this file exists.

## Files to Create

- `packages/ui/src/components/ui/dropdown-menu.tsx` — Shared shadcn dropdown-menu primitives built on the existing `radix-ui` package and `cn` utility.

## Files to Modify

- None expected. If the shadcn CLI updates package metadata or lockfiles, keep only necessary changes.

## Technical Details

### Implementation Steps

1. Confirm `packages/ui/src/components/ui/dropdown-menu.tsx` does not already exist.
2. Add the dropdown-menu component to the shared UI package using the shadcn CLI from the repository root or package context.
3. Preferred command from the repository root:

```bash
pnpm --filter @repo/ui dlx shadcn@latest add dropdown-menu
```

4. If the filtered command does not work with the workspace, run the shadcn command from `packages/ui` instead:

```bash
pnpm dlx shadcn@latest add dropdown-menu
```

5. Ensure generated imports match existing shared UI patterns. Existing `packages/ui/src/components/ui/button.tsx` imports utility as `import { cn } from "src/lib/utils"` and uses `radix-ui`, not scoped `@radix-ui/*` packages.
6. The generated component should export at least: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, and `DropdownMenuItem`.
7. Keep the component inside `packages/ui`; do not create app-local dropdown primitives.
8. Do not modify theme CSS variables or app root files in this task.

### Code Snippets

The downstream app task expects imports shaped like this:

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu'
```

Existing shared UI files use this utility import style:

```tsx
import { cn } from 'src/lib/utils'
```

Existing shared UI files use `radix-ui` for primitives, for example `button.tsx` imports:

```tsx
import { Slot } from 'radix-ui'
```

If manual implementation is needed instead of CLI generation, follow the current shadcn v4/new-york dropdown-menu component style and adapt imports to the monorepo conventions above.

### Environment Variables

None.

### API Endpoints

None.

## Acceptance Criteria

- [ ] `packages/ui/src/components/ui/dropdown-menu.tsx` exists.
- [ ] It exports `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, and `DropdownMenuItem`.
- [ ] It uses existing shared UI conventions, including `cn` from `src/lib/utils`.
- [ ] It relies on the existing `radix-ui` dependency already present in `packages/ui/package.json`; no unnecessary new Radix packages are added.
- [ ] It uses shadcn semantic tokens/classes and supports dark mode through existing CSS variables.
- [ ] No app-level files are modified by this task.
- [ ] `pnpm --filter @repo/ui check-types` passes after this task is implemented.

## Notes

The app-level `components.json` maps `ui` to `@repo/ui/components`, but this task should add the actual shared component under `packages/ui` so all apps can reuse it.
