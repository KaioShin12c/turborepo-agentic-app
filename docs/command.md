# Commands Reference

## Root-level Commands

Run these from the repo root. Turborepo orchestrates them across all packages.

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all dev servers (TanStack Start on port 3000, DB proxy, etc.) |
| `pnpm build` | Build all packages and apps for production |
| `pnpm check-types` | Run type-checking (`tsc --noEmit`) across all packages |
| `pnpm test` | Run all tests (Vitest) across all packages |
| `pnpm test:watch` | Run all tests in watch mode (re-runs on file changes) |
| `pnpm lint` | Check code quality with Biome linter (read-only) |
| `pnpm lint:fix` | Check code quality and auto-fix issues with Biome linter |
| `pnpm format` | Check code formatting with Biome formatter (read-only) |
| `pnpm format:fix` | Auto-format all code with Biome formatter |
| `pnpm ci` | Run Biome in CI mode (fails on any violation, no fixes) |

## Database Commands (Drizzle ORM)

Manage PostgreSQL schema and migrations via Drizzle.

| Command | Description |
|---------|-------------|
| `pnpm db:generate` | Generate SQL migration files from schema changes in `packages/db/src/schema.ts` |
| `pnpm db:migrate` | Apply pending migrations to the database |
| `pnpm db:studio` | Launch Drizzle Studio — a web GUI for browsing/editing DB data |

**Important**: Always run `db:generate` + `db:migrate` after schema changes. Never use `drizzle-kit push`.

## Target a Specific Package

Use Turborepo's `--filter` to scope commands to one package.

```
pnpm test --filter=@repo/db
pnpm test:watch --filter=@repo/ui
pnpm dev --filter=tanstack-app
```

## Docker (Infrastructure)

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start PostgreSQL 17 container in the background |

## App-specific Commands (tanstack-app)

Run from `apps/tanstack-app/` or via `--filter=tanstack-app`.

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start TanStack Start dev server on port 3000 |
| `pnpm build` | Build the app for production |
| `pnpm preview` | Serve the production build locally for testing |
