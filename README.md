# Turborepo Agentic App

A production-ready, full-stack monorepo boilerplate built with Turborepo, TanStack Start, and PostgreSQL.

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo + pnpm workspaces |
| App Framework | TanStack Start (full-stack React 19) + TanStack Router |
| Build | Vite 8 |
| Language | TypeScript 5.x |
| Database | PostgreSQL 17 + Drizzle ORM |
| Auth | Better Auth (email/password, GitHub OAuth) |
| UI | shadcn/ui (18 components) + Tailwind CSS v4 |
| Validation | Zod |
| Lint & Format | Biome |
| Testing | Vitest + Testing Library |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 9
- **Docker** (for PostgreSQL)

### Installation

```sh
pnpm install
```

### Environment Variables

Copy the example env file and fill in the required values:

```sh
cp packages/env/.env.example packages/env/.env
```

Required variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Auth secret key |
| `BETTER_AUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |

### Start the Database

```sh
docker compose up -d
```

### Run Database Migrations

```sh
pnpm db:generate
pnpm db:migrate
```

### Start the Dev Server

```sh
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
turborepo-agentic-app/
├── apps/
│   └── tanstack-app/         # Main application
│       └── src/
│           ├── routes/       # File-based routes
│           ├── components/   # Page-level components
│           ├── hooks/        # App-specific hooks
│           └── lib/          # Auth functions, utilities
├── packages/
│   ├── auth/                 # @repo/auth — Better Auth server + client
│   ├── db/                   # @repo/db — Drizzle schema, migrations, client
│   ├── env/                  # @repo/env — Zod-validated environment variables
│   ├── ui/                   # @repo/ui — shadcn/ui component library
│   ├── tailwind-config/      # @repo/tailwind-config — Shared Tailwind v4 config
│   ├── typescript-config/    # @repo/typescript-config — Shared TS configs
│   ├── vitest-config/        # @repo/vitest-config — Shared Vitest presets
│   └── biome-config/         # @repo/biome-config — Shared Biome rules
├── docker-compose.yml        # PostgreSQL 17
├── turbo.json                # Turborepo pipeline
└── pnpm-workspace.yaml       # Workspace config
```

## Available Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start all dev servers |
| `pnpm build` | Build all packages and apps |
| `pnpm test` | Run all tests via Vitest |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm check-types` | Type-check all packages |
| `pnpm lint` | Check code quality (Biome) |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm format` | Check formatting (Biome) |
| `pnpm format:fix` | Auto-fix formatting |
| `pnpm db:generate` | Generate Drizzle migration files |
| `pnpm db:migrate` | Apply pending database migrations |
| `pnpm db:studio` | Open Drizzle Studio (DB GUI) |

### Filter by Package

Use `--filter` to scope commands to a specific package:

```sh
pnpm test --filter=@repo/db
pnpm dev --filter=tanstack-app
```

## Features

- **Authentication** — Email/password login, signup, and GitHub OAuth with session management
- **Database** — Drizzle ORM with auto-generated migrations and Drizzle Studio for data browsing
- **UI Components** — 18 pre-built shadcn/ui components with dark/light theme support
- **Type Safety** — End-to-end TypeScript with Zod validation for environment variables
- **Testing** — Vitest configured across all packages with React Testing Library
- **Code Quality** — Biome for linting and formatting, Husky for pre-commit hooks
- **Docker** — One-command PostgreSQL setup with persistent data volume

## Documentation

- [Architecture Overview](docs/architecture.md) — Full tree structure and package descriptions
- [Commands Reference](docs/command.md) — All available commands
- [UI Design Guidelines](docs/ui-design.md) — Component strategy and styling rules
- [Agent Rules](AGENTS.md) — AI agent coding conventions

## License

MIT
