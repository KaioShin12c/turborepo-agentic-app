# Repo Architecture — Quick Reference

## Tree

```
turborepo-agentic-app/
├── apps/
│   └── tanstack-app/                       # Main application (TanStack Start + React 19)
│       ├── vite.config.ts                   # Vite: TanStack Start + Tailwind + React plugins
│       ├── tsconfig.json                    # TS strict, path aliases #/*  @/* → ./src/*
│       ├── components.json                 # shadcn/ui config, aliases point to @repo/ui
│       ├── src/
│       │   ├── router.tsx                  # Router creation + type registration
│       │   ├── routeTree.gen.ts            # AUTO-GENERATED — do not edit
│       │   ├── styles.css                  # App-specific CSS (atmosphere, animations)
│       │   ├── routes/                     # File-based routes (TanStack Router)
│       │   │   ├── __root.tsx              # Root shell: <html>, theme provider, meta, devtools
│       │   │   ├── index.tsx               # "/" — Landing page
│       │   │   ├── login.tsx               # "/login" — beforeLoad: redirect if logged in
│       │   │   ├── signup.tsx              # "/signup"
│       │   │   ├── dashboard.tsx           # "/dashboard" — beforeLoad: redirect if not logged in
│       │   │   └── api/auth/$.ts           # Catch-all Better Auth API proxy
│       │   ├── components/                 # Page-level components (1 per route)
│       │   │   ├── login-page.tsx          # Login form (email, password, GitHub OAuth)
│       │   │   ├── signup-page.tsx         # Signup form
│       │   │   ├── dashboard-page.tsx      # Dashboard with sidebar, metrics, session info
│       │   │   ├── not-found-page.tsx      # 404 page
│       │   │   ├── password-input.tsx      # Password input with show/hide toggle
│       │   │   ├── theme-provider.tsx      # Dark/light/system theme context + inline script
│       │   │   └── mode-toggle.tsx         # Theme toggle dropdown (sun/moon icons)
│       │   ├── hooks/                      # App-specific hooks (currently empty)
│       │   └── lib/
│       │       └── auth.functions.ts       # Server functions: getCurrentSession()
│       └── public/                         # Static assets
│
├── packages/
│   ├── auth/                               # @repo/auth — Better Auth wrapper
│   │   └── src/
│   │       ├── server.ts                   # betterAuth() + drizzleAdapter + email/password + GitHub + cookies plugin
│   │       └── client.ts                   # createAuthClient() + useSession hook
│   │
│   ├── db/                                 # @repo/db — Database layer
│   │   ├── src/
│   │   │   ├── index.ts                    # Drizzle client (node-postgres pool) + re-exports
│   │   │   └── schema.ts                   # Tables: user, session, account, verification (Better Auth)
│   │   ├── drizzle.config.ts                # Drizzle Kit config (postgresql)
│   │   └── drizzle/                        # SQL migration files (git-tracked)
│   │
│   ├── env/                                # @repo/env — Environment variables
│   │   ├── src/index.ts                    # Zod-validated env: DATABASE_URL, BETTER_AUTH_*, GITHUB_*
│   │   └── .env                            # Local dev values (not committed to git)
│   │
│   ├── ui/                                 # @repo/ui — Shared UI component library
│   │   └── src/
│   │       ├── components/ui/              # 18 shadcn/ui components (button, card, sidebar, etc.)
│   │       ├── hooks/use-mobile.ts         # useIsMobile() — 768px breakpoint hook
│   │       ├── lib/utils.ts                # cn() — clsx + tailwind-merge helper
│   │       └── styles/global.css           # Design tokens: CSS variables, light/dark themes, radius, shadows
│   │
│   ├── tailwind-config/                     # @repo/tailwind-config — Shared Tailwind v4 config
│   │   ├── index.css                       # @import "tailwindcss" + @source paths for content scanning
│   │   └── vite.ts                         # Vite Tailwind plugin wrapper
│   │
│   ├── typescript-config/                   # @repo/typescript-config — Shared TS configs
│   │   ├── base.json                       # Strict, ESNext modules, NodeNext resolution
│   │   ├── react-library.json              # Extends base + jsx: "react-jsx"
│   │   └── nextjs.json                     # Next.js config (placeholder)
│   │
│   └── biome-config/                        # @repo/biome-config — Shared lint/format rules
│       ├── base.json                       # Double quotes, semicolons, 2-space indent, 120 width
│       └── tanstack-start.json             # Ignores routeTree.gen.ts
│
├── package.json                            # Root: turbo scripts, biome, typescript
├── turbo.json                              # Pipeline: build, dev, check-types, db:*, lint, format
├── pnpm-workspace.yaml                     # Workspace globs: apps/* packages/*
├── docker-compose.yml                      # PostgreSQL 17 (port 5432, db: turborepo_agentic_app)
├── biome.jsonc                             # Root Biome config → extends @repo/biome-config
├── opencode.json                           # MCP servers: better-auth, context7, shadcn
├── AGENTS.md                               # AI agent coding rules
└── README.md                               # Generic Turborepo starter README (outdated)
```
