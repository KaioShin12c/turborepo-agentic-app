# Task 01: Refactor nav-section.tsx

## Status

complete

## Wave

1

## Description

Refactor the `NavSection` component in `nav-section.tsx` to use shadcn's sidebar menu primitives (`SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`) instead of custom `<nav>` with manual link rendering and manual tooltip wrapping. The shadcn `SidebarMenuButton` already has built-in tooltip support via its `tooltip` prop, and built-in collapsible styling via `group-data-[collapsible=icon]`.

The `NavItem` interface and `nav-data.ts` do NOT change. The same nav data arrays (NAV_MAIN, NAV_MANAGEMENT, NAV_SETTINGS) must render identically.

## Dependencies

**Depends on:** None (Wave 1 — independent)
**Blocks:** task-02-app-sidebar.md (the AppSidebar component will import this refactored NavSection)

**Context from dependencies:** No prior tasks. The shadcn sidebar components are already installed at `packages/ui/src/components/ui/sidebar.tsx` and exported via `@repo/ui/components/ui/sidebar`. The `NavItem` interface is defined in the current `nav-section.tsx` — this task must keep it (or move it) for backward compatibility.

## Files to Modify

- `apps/tanstack-app/src/shared/components/nav-section.tsx` — Replace custom nav with shadcn sidebar menu primitives

## Files to Create

None.

## Technical Details

### Current nav-section.tsx Behavioral Spec

The component accepts:
```typescript
interface NavSectionProps {
  title: string;           // e.g., "MAIN MENU"
  visible: boolean;        // true when sidebar is expanded
  items: NavItem[];        // nav items with label, icon, path
  currentPath?: string;    // current route path for active detection
  onItemClick?: () => void; // callback on item click (used by mobile nav)
}

interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  path: string;
}
```

### Target Implementation: Use shadcn Sidebar Menu Components

Replace the custom implementation with this structure:

```tsx
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@repo/ui/components/ui/sidebar";
import { cn } from "@repo/ui/lib/utils";
import { Link } from "@tanstack/react-router";

// NavItem interface stays the same
export interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  path: string;
}

// NavSectionProps — visible prop determines whether labels are shown
interface NavSectionProps {
  title: string;
  visible: boolean;
  items: NavItem[];
  currentPath?: string;
  onItemClick?: () => void;
}

export function NavSection({ title, visible, items, currentPath, onItemClick }: NavSectionProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel
        className={cn(
          // Match current: text-[11px] font-semibold tracking-[0.12em] text-muted-foreground
          // SidebarGroupLabel default hides on collapsed; we also hide on !visible (manual close)
          !visible && "lg:hidden",
        )}
      >
        {title}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const active =
            currentPath === item.path ||
            (item.path !== "/" && currentPath?.startsWith(item.path));
          return (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={active}
                tooltip={item.label}
                size="lg"  // h-10 to match current
                className={cn(
                  // Override active state: current uses bg-primary text-primary-foreground
                  // shadcn default: data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground
                  // We override with our active colors
                  "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
                  // Default (non-active) state
                  "text-sidebar-foreground/80",
                  // Hover: current uses hover:bg-muted
                  "hover:bg-muted hover:text-foreground",
                  // Match current rounded-lg px-3 gap-3
                  "rounded-lg",
                )}
              >
                <Link to={item.path} onClick={onItemClick} className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
```

### Key Design Decisions

1. **Active state override**: The shadcn sidebar default active uses `data-[active=true]:bg-sidebar-accent`. The current design uses `bg-primary text-primary-foreground`. Override via the `className` prop on `SidebarMenuButton`.

2. **Tooltip**: `SidebarMenuButton` with `tooltip={item.label}` automatically wraps in a `Tooltip` (the sidebar context includes `TooltipProvider`). The tooltip automatically hides when sidebar is expanded and shows when collapsed.

3. **SidebarGroup vs custom div**: Replace `<div className="mt-6 first:mt-0">` with `SidebarGroup` (default spacing). If the spacing differs from current, add a custom className: `className="mt-6 first:mt-0"`.

4. **Hover state**: Current uses `hover:bg-muted`. shadcn default uses `hover:bg-sidebar-accent`. Add `hover:bg-muted` to override.

5. **`visible` prop**: In the current implementation, `visible` controls whether section titles and nav labels are visible. With shadcn sidebar's `collapsible="icon"` mode, the `group-data-[collapsible=icon]` variants handle label hiding automatically via CSS. However, since the current sidebar uses manual `visible` control (from local state, not CSS), the `visible` prop should still work for the manual case. The CSS approach (`group-data-[collapsible=icon]`) works when using shadcn's `collapsible` mode — and this will be the approach after task 02 refactors sidebar.tsx to use it.

   **Decision**: Remove the manual `visible` prop control for label visibility and rely on shadcn's built-in `group-data-[collapsible=icon]`. The prop name `visible` should remain in the interface for backward compatibility but its usage should transition to CSS-driven behavior:
   - If the layout still needs manual control, keep the `lg:opacity-0 lg:max-w-0` pattern from current code
   - Otherwise, remove manual visibility classes and let shadcn handle it

   **Actual implementation**: Keep the `visible` prop because `task-02` may still need it during transition. Apply the shadcn-compatible approach: when `visible` is true, let them show; when false, add the hide classes. The important thing is that `SidebarMenuButton`'s built-in `tooltip` prop handles the collapsed tooltip automatically.

6. **Icon size**: Pass `size={18}` as before. SidebarMenuButton accepts children with icons inside the button.

7. **`asChild`**: Set `asChild={true}` and render a `<Link>` as the child. This makes the entire SidebarMenuButton clickable via the router's Link component.

### spacing behavior — note on mt-6 first:mt-0

The current code uses `mt-6 first:mt-0` on the group wrapper div. SidebarGroup has default `p-2`. To match spacing, either:
- Add `className="mt-6 first:mt-0"` to SidebarGroup
- Or trust the SidebarGroup defaults (slight spacing difference, acceptable)

For pixel-perfect match, add the className.

### Linting / Code Style

- No comments in the file
- Use `cn()` for all className merging
- Single named export: `NavSection`
- Keep `NavItem` interface exported from this file

## Acceptance Criteria

- [ ] `NavSection` uses `SidebarGroup`, `SidebarGroupLabel`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton` from `@repo/ui/components/ui/sidebar`
- [ ] Active nav item has `bg-primary text-primary-foreground` styling
- [ ] Default nav item has `text-sidebar-foreground/80 hover:bg-muted hover:text-foreground`
- [ ] Tooltip shows on hover when sidebar is collapsed (via SidebarMenuButton's `tooltip` prop)
- [ ] Section titles display with the same uppercase muted style
- [ ] `onItemClick` callback still fires on link click (for mobile nav)
- [ ] `NavItem` interface remains exported unchanged
- [ ] Icon size remains 18
- [ ] No TypeScript errors — `import type { NavItem }` still resolves from `nav-data.ts`
- [ ] Visual spacing between sections matches current (mt-6 with first:mt-0)
- [ ] No comments in file

## Notes

- The `visible` prop is kept in the interface but may become less important once shadcn's `collapsible="icon"` mode handles visibility via CSS. Keep it for backward compatibility with `task-02`.
- Do NOT modify `nav-data.ts` — nav item data stays the same.
- Do NOT create a separate types file — keep `NavItem` in `nav-section.tsx`.
- The shadcn sidebar package already handles `TooltipProvider` wrapping internally, so individual `Tooltip` wrappers are not needed on each item.
