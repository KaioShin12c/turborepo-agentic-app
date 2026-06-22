# Task 02: Refactor sidebar.tsx to AppSidebar

## Status

pending

## Wave

2

## Description

Replace the current custom `<aside>` sidebar implementation with a new `AppSidebar` component that composes shadcn's sidebar primitives: `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`. The sidebar must look visually identical to the current version while benefiting from shadcn's built-in state management, collapsible icon mode, and mobile support.

The refactored component uses shadcn's `SidebarProvider` context (provided by the parent layout in task 03) rather than receiving `sidebarOpen`/`onToggle` as props. The toggle button uses `SidebarTrigger` (customized to match current button style) or a custom button using `useSidebar()`.

## Dependencies

**Depends on:** task-01-nav-section.md (this component imports the refactored `NavSection` with its new shadcn-compatible interface)
**Blocks:** task-03-update-layout.md (the layout will import this component)

**Context from dependencies:**
- `nav-section.tsx` has been refactored to use `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton` with tooltip support via `tooltip` prop
- `NavItem` and `NavSection` interfaces remain unchanged — same props as before
- Navigation data (`NAV_MAIN`, `NAV_MANAGEMENT`, `NAV_SETTINGS`) from `nav-data.ts` is unchanged

## Files to Modify

- `apps/tanstack-app/src/shared/components/sidebar.tsx` — Replace the entire file content

## Files to Create

None.

## Technical Details

### Target Interface

The refactored component should NOT accept `sidebarOpen`/`onToggle` props. Instead, it consumes the `SidebarProvider` context internally via the `Sidebar` component.

```typescript
// New interface — simpler, no state props needed
interface AppSidebarProps {
  currentPath?: string;
  className?: string;
}
```

### Complete Implementation

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@repo/ui/components/ui/sidebar";
import { cn } from "@repo/ui/lib/utils";
import { ArrowLeftToLine, ArrowRightToLine, Library } from "lucide-react";
import { NAV_MAIN, NAV_MANAGEMENT, NAV_SETTINGS } from "./nav-data";
import { NavSection } from "./nav-section";
import * as React from "react";

interface AppSidebarProps {
  currentPath?: string;
  className?: string;
}

export function AppSidebar({ currentPath, className }: AppSidebarProps) {
  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        // Match current background/border
        "border-r border-border bg-card",
        className,
      )}
    >
      <SidebarHeader className="flex h-[72px] shrink-0 flex-row items-center gap-0 border-b border-border px-3 overflow-hidden">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Library size={22} />
        </div>
        <span className="ml-2 text-2xl font-bold tracking-tight text-primary truncate group-data-[collapsible=icon]:hidden">
          Bookary
        </span>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto overflow-x-hidden px-3 pt-4">
        <NavSection title="MAIN MENU" visible={true} items={NAV_MAIN} currentPath={currentPath} />
        <NavSection title="MANAGEMENT" visible={true} items={NAV_MANAGEMENT} currentPath={currentPath} />
        <NavSection title="SETTING & OTHERS" visible={true} items={NAV_SETTINGS} currentPath={currentPath} />
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarTrigger
          className={cn(
            "flex w-full items-center justify-center rounded-lg h-10",
            "bg-muted text-muted-foreground",
            "hover:bg-accent hover:text-foreground",
            "transition-colors",
          )}
        >
          <ArrowLeftToLine size={18} className="group-data-[state=expanded]:block hidden" />
          <ArrowRightToLine size={18} className="group-data-[state=collapsed]:block hidden" />
        </SidebarTrigger>
      </SidebarFooter>
    </Sidebar>
  );
}
```

### Width Adjustments

The shadcn sidebar uses CSS variables for width:
- `--sidebar-width: 16rem` (256px — but current is `w-64` = 256px, so this matches!)
- `--sidebar-width-icon: 3rem` (48px — but current collapsed is `w-16` = 64px)
- Mobile: `--sidebar-width-mobile: 18rem` (288px)

**The default `--sidebar-width` of 16rem equals `w-64`** — so no override needed for expanded width.

**But `--sidebar-width-icon` defaults to 3rem (48px), and current uses `w-16` (64px)**. We need to override this. There are two approaches:

1. **Preferred**: Set a custom CSS variable on the parent wrapper or via style prop
2. **Alternative**: Use className to set `w-16` on the collapsed sidebar

Since we can't easily pass CSS vars to the shadcn sidebar wrapper (it's rendered inside SidebarProvider), we can set the width via design tokens or just accept the 3rem default — the difference (48px vs 64px) is visually small. However, for pixel-identical match, we should handle it.

**Approach**: Set `--sidebar-width-icon` CSS variable on the `Sidebar` component itself via the `style` prop or by wrapping with a div that has this variable. Since `Sidebar` passes through `...props` to the container div, we can:

```tsx
<Sidebar
  collapsible="icon"
  style={{ "--sidebar-width-icon": "4rem" } as React.CSSProperties}
  ...
>
```

This overrides the icon-width variable to 4rem (64px) to match the current `w-16`.

### Brand/Header Behavior

Current: brand text fades in/out manually with `sidebarOpen` state. With shadcn's `collapsible="icon"`, the `group-data-[collapsible=icon]` variant handles hiding text. Using `group-data-[collapsible=icon]:hidden` on the brand span achieves the same effect.

### Toggle Button

The current toggle button uses custom SVG icons (ArrowLeftToLine/ArrowRightToLine) and custom styling. Shadcn's `SidebarTrigger` renders a `Button` with `PanelLeftIcon`. We need to customize it:

**Option A**: Use `SidebarTrigger` with children to override the icon and className to override styling.

```tsx
<SidebarTrigger className="custom classes here">
  <ArrowLeftToLine size={18} />
  <ArrowRightToLine size={18} />
  <span className="sr-only">Toggle Sidebar</span>
</SidebarTrigger>
```

Problem: `SidebarTrigger` always renders one set of children regardless of state. The icon swapping needs to be CSS-driven.

**Option B**: Create a custom toggle button using `useSidebar()` from the sidebar context. This gives full control.

Given that the current design uses two different icons (ArrowLeftToLine vs ArrowRightToLine), and `SidebarTrigger` renders a single icon, **Option B** with CSS visibility toggling is cleaner. But `SidebarTrigger` renders a `<Button>` component which we can customize with className.

**Recommended**: Use `SidebarTrigger` but hide its default icon via CSS and render custom icons as children. The shadcn sidebar automatically applies `group-data-[state=expanded]` and `group-data-[state=collapsed]` data attributes that we can target:

```tsx
<SidebarTrigger
  className={cn(
    "flex w-full items-center justify-center rounded-lg h-10",
    "bg-muted text-muted-foreground",
    "hover:bg-accent hover:text-foreground",
    "transition-colors",
  )}
>
  <ArrowLeftToLine size={18} className="group-data-[state=collapsed]/sidebar-wrapper:hidden" />
  <ArrowRightToLine size={18} className="group-data-[state=expanded]/sidebar-wrapper:hidden" />
  <span className="sr-only">Toggle Sidebar</span>
</SidebarTrigger>
```

Wait, the `group` for sidebar state is on the `SidebarProvider` wrapper div (`group/sidebar-wrapper`). So the CSS selectors use `group-data-[state=expanded]/sidebar-wrapper`.

Actually, let me reconsider. Looking at the shadcn sidebar implementation more carefully:

- `SidebarProvider` renders a wrapper div with `className="group/sidebar-wrapper"`
- The `Sidebar` component doesn't use the state data attributes on the `group` wrapper. Instead, the sidebar data attributes are on the inner elements.

For `SidebarTrigger`, we can check the current sidebar state using the `useSidebar()` hook to conditionally render icons. This is simpler and more reliable than CSS selectors.

**Final decision — custom button using `useSidebar()`**:

```tsx
function SidebarToggleButton() {
  const { open } = useSidebar();

  return (
    <SidebarTrigger
      className={cn(
        "flex w-full items-center justify-center rounded-lg h-10",
        "bg-muted text-muted-foreground",
        "hover:bg-accent hover:text-foreground",
        "transition-colors",
      )}
    >
      {open ? <ArrowLeftToLine size={18} /> : <ArrowRightToLine size={18} />}
      <span className="sr-only">Toggle Sidebar</span>
    </SidebarTrigger>
  );
}
```

This requires `useSidebar()` to be available — which it is since `AppSidebar` is rendered inside `SidebarProvider` (set up in task 03). But `SidebarTrigger` itself already uses `useSidebar()` internally, so the `open` state IS accessible anywhere inside the provider tree.

### TooltipProvider

The current sidebar wraps in `<TooltipProvider delayDuration={0}>`. The shadcn `SidebarProvider` already provides a `TooltipProvider` internally, so the manual wrapping in sidebar.tsx is no longer needed.

### SidebarContent spacing

Current uses `px-3 pt-4`. Pass these classes to `SidebarContent` via `className`.

### `visible` prop on NavSection

Since we're using `collapsible="icon"` mode on `Sidebar`, the `visible` prop can be `true` at all times — the CSS-driven `group-data-[collapsible=icon]` variants handle hiding text/icons in collapsed mode. Pass `visible={true}` to all NavSection calls.

### Export

Export the component as `AppSidebar` (to avoid naming conflict with shadcn's `Sidebar`):
```typescript
export function AppSidebar({ currentPath, className }: AppSidebarProps) { ... }
```

Any other file importing the sidebar (like `mobile-nav.tsx`) should NOT be modified — only the layout file (task 03) should change its import.

## Acceptance Criteria

- [ ] `AppSidebar` uses shadcn's `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarTrigger`
- [ ] Background matches current: `bg-card border-r border-border`
- [ ] Header height matches current: `h-[72px]` with border-b
- [ ] Library icon renders in `bg-primary text-primary-foreground rounded-xl size-10`
- [ ] "Bookary" brand text renders in `text-primary font-bold tracking-tight` and hides on collapse
- [ ] Navigation renders via the refactored `NavSection` component
- [ ] Collapse/expand toggle button has custom styling: `bg-muted text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg h-10`
- [ ] Toggle button shows `ArrowLeftToLine` (size 18) when expanded, `ArrowRightToLine` (size 18) when collapsed
- [ ] Collapsed width matches current `w-16` (4rem), expanded width matches current `w-64` (16rem)
- [ ] `collapsible="icon"` mode is used
- [ ] No more `sidebarOpen`/`onToggle` props — state managed by `SidebarProvider`
- [ ] No more manual `<TooltipProvider>` wrapping (SidebarProvider provides it)
- [ ] `visible={true}` passed to all NavSection calls
- [ ] No TypeScript errors
- [ ] No comments in file

## Notes

- The shadcn `SidebarProvider` internally sets up `TooltipProvider` — do not wrap manually.
- `SidebarProvider` must be rendered by the parent layout (task 03), not inside this component. This component ASSUMES it's rendered inside `SidebarProvider`.
- The `--sidebar-width-icon` CSS variable override is set via the `style` prop to `4rem` to match `w-16`.
- Do NOT modify the `Sidebar` component in `packages/ui` — all overrides go on the instance in this file.
