# Requirements: Refactor Sidebar to shadcn/ui

## Summary

The current desktop sidebar (`apps/tanstack-app/src/shared/components/sidebar.tsx`) is a custom implementation built from scratch with a `<aside>` element and manual collapsible animation logic. The app already has the full shadcn/ui sidebar component suite installed at `packages/ui/src/components/ui/sidebar.tsx` (SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, etc.), but the app-side code does not use it.

This refactor replaces the custom sidebar with shadcn's sidebar primitives while **preserving the exact current visual appearance**: same colors, same dimensions, same animations, same spacing, same typography.

## Current Architecture

```
_authenticated/route.tsx (layout)
├── sidebar.tsx — custom <aside> with sidebarOpen/onToggle props
│   ├── Header: Library icon + "Bookary" brand
│   ├── Nav sections via nav-section.tsx
│   └── Toggle button (ArrowLeft/ArrowRight)
├── mobile-nav.tsx — Sheet-based mobile nav (NOT in scope for this refactor)
├── top-bar.tsx — header bar with user menu
└── Outlet
```

Navigation data lives in `nav-data.ts` (three arrays: NAV_MAIN, NAV_MANAGEMENT, NAV_SETTINGS). The `nav-section.tsx` component renders each group with a section title and nav link items with Tooltips for collapsed state.

## Current Visual Style (Must Preserve)

| Element | Classes / Values |
|---------|-----------------|
| Sidebar panel | `bg-card border-r border-border`, expanded `w-64`, collapsed `w-0 lg:w-16` |
| Header area | `h-[72px]`, icon in `bg-primary text-primary-foreground rounded-xl size-10`, brand in `text-primary font-bold tracking-tight` |
| Section title | `text-[11px] font-semibold tracking-[0.12em] text-muted-foreground px-2`, hidden when collapsed |
| Nav item default | `text-sidebar-foreground/80 hover:bg-muted`, `h-10`, `rounded-lg px-3 gap-3` |
| Nav item active | `bg-primary text-primary-foreground` |
| Nav item collapsed | `lg:size-10 lg:px-[11px]`, text hidden, tooltip shown |
| Toggle button | `bg-muted text-muted-foreground hover:bg-accent hover:text-foreground`, `h-10 rounded-lg` |
| Toggle icons | `ArrowLeftToLine` (open) / `ArrowRightToLine` (closed), `size={18}` |
| Overall transition | `transition-[width] duration-300` |

## shadcn Sidebar Default Behavior

The installed shadcn sidebar at `packages/ui/src/components/ui/sidebar.tsx` provides:

| Component | Purpose |
|-----------|---------|
| `SidebarProvider` | Context provider for open/close state, mobile detection, keyboard shortcut (Ctrl+B) |
| `Sidebar` | The sidebar panel (desktop: fixed left panel, mobile: Sheet overlay) |
| `SidebarHeader` | Header section |
| `SidebarContent` | Scrollable content area |
| `SidebarFooter` | Footer section |
| `SidebarGroup` / `SidebarGroupLabel` | Navigation group with label |
| `SidebarMenu` / `SidebarMenuItem` / `SidebarMenuButton` | Menu list structure |
| `SidebarTrigger` | Toggle button (renders PanelLeftIcon) |
| `useSidebar()` | Hook to access open/toggle state |

Default widths: `--sidebar-width: 16rem`, `--sidebar-width-icon: 3rem`
Default collapse mode: `collapsible="offcanvas"` (hides entirely, not icon mode)

## Goals

- Replace the custom `<aside>` sidebar with shadcn's `Sidebar` component and its sub-components
- Use `SidebarProvider` for state management instead of local `useState` in the layout
- Use `SidebarMenuButton` and related components in `nav-section.tsx` instead of custom link rendering
- Preserve exact visual appearance through className overrides and CSS variable adjustments
- Remove dead code: the custom open/close toggle logic, manual width classes, manual tooltip logic
- Keep `mobile-nav.tsx` and its integration unchanged

## Non-Goals

- Redesign or restyle the sidebar visually
- Change the navigation data structure or routes
- Refactor `mobile-nav.tsx` (it already uses shadcn Sheet and works fine)
- Add new sidebar features (sub-menus, search, user profile in sidebar)
- Change the sidebar collapse behavior from desktop-only to responsive

## Acceptance Criteria

- [ ] The sidebar uses shadcn's `SidebarProvider`, `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarFooter` structural components
- [ ] The sidebar uses shadcn's `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton` for navigation items
- [ ] Toggle button uses shadcn's `SidebarTrigger` (customized to match current button style, or replaced with custom button using `useSidebar`)
- [ ] Visual appearance is pixel-identical to current: same colors, sizes, spacing, transitions
- [ ] Collapsed/expanded states work correctly on desktop (≥1024px)
- [ ] Active nav item highlighting matches current (`bg-primary text-primary-foreground`)
- [ ] Tooltip appears on collapsed nav items showing the label
- [ ] Toggle button switches between ArrowLeft/ArrowRight based on state
- [ ] The authenticated layout works without regression (auth guard, sign out, error display)
- [ ] Mobile nav still opens/closes independently (mobile nav is unchanged)
- [ ] No visual regression in light and dark themes
- [ ] No TypeScript errors

## Technical Constraints

- Uses the existing shadcn sidebar from `@repo/ui/components/ui/sidebar` — do not modify package code
- All styling overrides via Tailwind className props, not by editing the package
- CSS variables in `global.css` should NOT be changed unless absolutely necessary
- Must use `cn()` from `@repo/ui/lib/utils` for class merging
- Must use the existing `nav-data.ts` and its `NavItem` interface unchanged
- No new npm dependencies
- No database migrations
