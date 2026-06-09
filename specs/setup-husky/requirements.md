# Requirements: Setup Husky

## Objective

Set up Husky git hooks for the Turborepo monorepo to enforce code quality checks automatically before commits and pushes.

## Background

The repo uses:
- **Biome** for linting and formatting (configured via `@repo/biome-config`)
- **Turborepo** for orchestrating builds, type-checks, and tests across packages
- **pnpm** as the package manager (v9+)
- **TypeScript** 5.9+ with strict mode

Currently, there are no git hooks. Developers must remember to run `pnpm lint` and `pnpm check-types` manually. Husky will automate this.

## Acceptance Criteria

1. **Pre-commit hook** runs Biome (`biome check --write`) on staged files only (via lint-staged) — fast, < 2 seconds for typical changes
2. **Pre-push hook** runs type-check (`pnpm check-types`) and tests (`pnpm test`) across all packages before pushing
3. `pnpm install` automatically sets up git hooks (via the `prepare` lifecycle script)
4. Existing CI commands (`pnpm lint`, `pnpm ci`) continue to work unchanged
5. No impact on existing Biome configuration or workspace structure

## Technical Decisions

- **Husky v9** (latest, zero-config)
- **lint-staged** for fast pre-commit checks on staged files only
- Pre-commit runs `biome check --write` (auto-fix) on staged source files
- Pre-push runs turborepo commands: `pnpm check-types` then `pnpm test`
- Hook files use plain shell scripts (Husky v9 convention: `.husky/pre-commit`, `.husky/pre-push`)
- lint-staged config lives in root `package.json` under `"lint-staged"` key

## Scope

- Root `package.json` — add dependencies, scripts, and lint-staged config
- `.husky/pre-commit` — new hook file
- `.husky/pre-push` — new hook file
- No changes to existing Biome config, turbo.json, or any package source code
