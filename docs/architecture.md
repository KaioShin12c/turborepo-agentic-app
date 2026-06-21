# Repo Architecture — Quick Reference

## Tree

```
turborepo-agentic-app/
├── apps/
│   └── tanstack-app/            # Main application (TanStack Start + React 19)
│       ├── src/
│       │   ├── router.tsx       # Router setup + type registration
│       │   ├── routes/          # File-based routes (page content lives here)
│       │   │   ├── __root.tsx   # Root shell: <html>, theme, meta, devtools
│       │   │   ├── _auth/       # Pathless layout — guest-only (redirects if logged in)
│       │   │   ├── _authenticated/  # Pathless layout — auth-required + Sidebar + TopBar
│       │   │   └── api/auth/    # Better Auth catch-all proxy
│       │   ├── features/        # Feature modules (reusable components, schemas, server fns)
│       │   │   ├── auth/        # Login/signup forms, auth schemas, password input
│       │   │   ├── books/       # Book list, add form, table, filters, pagination
│       │   │   │   ├── schemas/      # Zod validation schemas
│       │   │   │   ├── components/   # Reusable UI components (form, table, filters, pagination)
│       │   │   │   ├── types.ts      # TypeScript interfaces (Book)
│       │   │   │   ├── constants.ts  # Shared constants (CATEGORIES, STATUSES, etc.)
│       │   │   │   └── data.ts       # Mock data (BOOKS)
│       │   │   ├── dashboard/   # Stat cards, revenue chart, overdue table
│       │   │   └── landing/     # Hero section, entry card (sign in / sign up)
│       │   └── shared/          # Shared code across features
│       │       └── components/  # Theme toggle, sidebar, top bar, nav, form fields, 404
│       └── public/              # Static assets
│
├── packages/
│   ├── auth/                    # @repo/auth — Better Auth: server config, client hooks
│   ├── db/                      # @repo/db — Drizzle ORM: schema, client, migrations
│   ├── env/                     # @repo/env — Zod-validated environment variables
│   ├── ui/                      # @repo/ui — 18 shadcn/ui components + cn() utility
│   ├── tailwind-config/         # @repo/tailwind-config — Shared Tailwind v4 CSS + Vite plugin
│   ├── typescript-config/       # @repo/typescript-config — Shared TS configs (base, react, nextjs)
│   ├── vitest-config/           # @repo/vitest-config — Shared Vitest presets (node, react)
│   └── biome-config/            # @repo/biome-config — Shared lint/format rules
│
├── package.json                 # Root: turbo scripts, biome, typescript
├── turbo.json                   # Pipeline: build, dev, check-types, test, db:*, lint, format
├── pnpm-workspace.yaml          # Workspaces: apps/* packages/*
├── docker-compose.yml           # PostgreSQL 17 (port 5432)
├── biome.jsonc                  # Root Biome config → extends @repo/biome-config
├── AGENTS.md                    # AI agent coding rules
└── README.md                    # Project README
```

## Component Organization

### Page = thin wrapper

Page files in `routes/` only contain layout skeleton (Card, header, back button). All UI + logic is delegated to components in `features/`.

```tsx
// routes/_authenticated/books/add.tsx — thin page
function AddBookPage() {
  return (
    <Card>
      <CardHeader>...</CardHeader>
      <CardContent>
        <AddBookForm onCancel={...} />
      </CardContent>
    </Card>
  );
}
```

### One component per file

Each `.tsx` file exports only one component. Group related components into the `components/` subfolder. Non-component files (schemas, types, constants, data) live at the feature root level.

```
features/books/
  schemas/                   # Zod validation schemas
  components/                # Reusable UI components
    add-book-form.tsx
    books-filters.tsx
    books-pagination.tsx
    books-table.tsx
  types.ts                   # TypeScript interfaces
  constants.ts               # Shared constants
  data.ts                    # Mock data
```

### Separate schema validation

Zod schemas and inferred types are kept in a `schemas/` subdirectory as dedicated `*.schema.ts` files for reuse between client and server.

```ts
// features/books/schemas/book-form.schema.ts
export const addBookSchema = z.object({ ... });
export type AddBookFormValues = z.infer<typeof addBookSchema>;
```

### Shared constants in `constants.ts`

Common constants within a folder (classes, config) go into `constants.ts`.

### Prefer shadcn/ui components

Always use shadcn components instead of raw markup:

| Replace | With |
|---------|------|
| `<table>` / `<th>` / `<td>` | `Table` / `TableHead` / `TableCell` |
| `<span>` as badge | `Badge` |
| Manual pagination logic | `Pagination` / `PaginationLink` |
| `<div>` status messages | `Alert` / `AlertDescription` |

### Form field wrappers

Use `FormInput` / `FormSelect` / `FormTextarea` instead of bare `Input` / `Select` / `Textarea`. These wrappers auto-attach `data-invalid` + `aria-invalid` + error message.

```tsx
<FormInput id="title" label="Title" error={errors.title?.message} {...register("title")} />
<FormSelect id="category" label="Category" value={cat} onValueChange={...} options={CATEGORIES} />
```

### Spacing: `gap-*`, not `space-y-*`

```tsx
<div className="flex flex-col gap-6">  // correct
<div className="space-y-6">           // avoid
```

## Route Conventions

### Directory-based routing (no flat naming)

Routes are organized by directory, NOT using flat filenames like `books.add.tsx`:

```
# CORRECT — directory-based
routes/products/index.tsx     → /products/
routes/products/add.tsx       → /products/add
routes/products/$id.tsx       → /products/$id

# WRONG — flat naming (do not use)
routes/products.index.tsx
routes/products.add.tsx
```

### Pathless layouts (shared shell)

Shared layouts live in `_`-prefixed directories, with a `route.tsx` file as the layout definition:

```
routes/
  _authenticated/             # Pathless layout: auth required
    route.tsx                 # Layout: auth guard + Sidebar + TopBar + signOut → <Outlet />
    dashboard.tsx             # /dashboard
    books.tsx                 # /books layout
    books/
      index.tsx               # /books/
      add.tsx                 # /books/add

  _auth/                      # Pathless layout: guest-only
    route.tsx                 # Layout: redirect to /dashboard if logged in → <Outlet />
    login.tsx                 # /login
    signup.tsx                # /signup
```

**Rules:**
- `_`-prefixed folder = pathless layout, does not add a URL segment
- Inner `route.tsx` = layout definition (beforeLoad, component, context)
- Layout uses `<Outlet />` to render children
- Parent layout passes context (`session`, etc.) to children via `Route.useRouteContext()`
- Each page does NOT import Sidebar/TopBar directly — the parent layout handles that

### Route file pattern (page content in route)

Page content lives directly in the route file, NOT split out into `features/`.
Only extract into a separate component when it is **reusable** (used in multiple places).

```tsx
// routes/_authenticated/dashboard.tsx
import { createFileRoute } from "@tanstack/react-router";
import { StatCard } from "../../features/dashboard/components/stat-card";
import { RevenueChart } from "../../features/dashboard/components/revenue-chart";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  // full page content goes here
  return <div>...</div>;
}
```

**Rules:**
- Route ID in `createFileRoute` must match the file path (relative to `routes/`)
- Page content lives directly in the route file — do not import page component from `features/`
- Only import reusable components (StatCard, PasswordInput, RevenueChart…) from `features/`
- Session is obtained from parent layout context via `Route.useRouteContext()`, not by calling `getCurrentSession()` again

### Sidebar navigation (Link-based)

Nav items use `Link` from `@tanstack/react-router` with path and active-path detection:

```ts
// shared/components/nav-data.ts
export const NAV_MAIN: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Books",      icon: BookOpen,        path: "/books" },
];
```

`nav-section.tsx` auto-detects active state via `currentPath.startsWith(item.path)` — no hardcoded `active` prop needed.

## IMPORTS

- Use `#/*` alias (maps to `src/*`) for all intra-app imports within `apps/tanstack-app/` instead of relative paths.
- External packages (`@repo/...`, `lucide-react`, `react`, etc.) use their standard package names.

