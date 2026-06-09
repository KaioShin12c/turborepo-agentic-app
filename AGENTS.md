# CRITICAL RULES - MUST FOLLOW

## TECH STACK

| Layer          | Technology                                                 |
| -------------- | ---------------------------------------------------------- |
| Monorepo       | Turborepo + pnpm workspaces                                |
| App Framework  | TanStack Start (full-stack React 19) + TanStack Router     |
| Build          | Vite 8                                                     |
| Language       | TypeScript 5.x / 6.x                                       |
| Database       | PostgreSQL + Drizzle ORM                                   |
| Auth           | Better Auth (email/password, GitHub OAuth, cookies plugin) |
| UI Components  | shadcn/ui (18 components in `@repo/ui`)                    |
| Styling        | Tailwind CSS v4                                            |
| Validation     | Zod v3 (server) / v4 (client)                              |
| Forms          | React Hook Form                                            |
| Icons          | Lucide React                                               |
| Lint & Format | Biome                                                      |
| Testing        | Vitest + Testing Library (React + jsdom)                   |

## REPO REFERENCE

- **Architecture**: `docs/architecture.md` — full tree structure, package descriptions, file locations. Consult this first when navigating the codebase.
- **Commands**: `docs/command.md` — all available commands (dev, build, test, db, lint, format, Docker). Quick reference for running and managing the project.

## RESPONSES

- Keep responses concise and to the point - unless the user asks otherwise

## PLANNING MODE

- Ask clarifying questions whenever requirements are ambiguous.
- Do not ask unnecessary questions when the task is already well-defined.
- Never assume design, tech stack or features
- Use deep-dive sub-agents to assist with research
- Use deep-dive sub-agents to review the different aspects of your plan before presenting to the user

## CHANGE / EDIT MODE

- Prefer sub-agents for implementation whenever available. Act primarily as a coordinator and delegate work whenever possible.
- Identify changes from the plan that can be implemented in parallel, and use sub-agents to implement the features efficiently
- Use the best model for the task - premium models for complex tasks (like coding) and mid-tier models for simpler tasks, like documentation
- After completing features (large or small), always run commands like lint, type check and next build to check code quality

## DATABASE SCHEMA CHANGES

- Whenever you make changes to the database schema, ALWAYS run the drizzle generate and migrate commands
- NEVER run drizzle push!
- For all ID columns NOT related to BetterAuth, use UUID for the ID columns and be randomly generated

## TESTING

- Vitest is configured across all packages via `@repo/vitest-config` (node + react/jsdom presets)
- Run `pnpm test` from root to execute all tests via Turborepo
- Run `pnpm test --filter=<package>` to test a single package
- Use explicit imports (`import { describe, it, expect } from "vitest"`) — globals are disabled
- Place test files next to source files (`*.test.ts` / `*.test.tsx`)
- Use `@testing-library/react` + `@testing-library/jest-dom` for React component tests
- Use `vi.mock()` for mocking dependencies in node packages
- Never assume your changes simply work, always test!

## UI DESIGN

- Refer to `docs/ui-design.md` for component strategy, styling rules, responsiveness, and consistency guidelines.
