# Task 03: Configure Pre-push Hook

## Status: complete

## Wave

Wave 2 — depends on Task 01 (Husky installed and `.husky/` directory exists)

## What Task 01 Provides

- `husky` is installed as a dev dependency
- `.husky/` directory exists
- Root `package.json` has `"prepare": "husky"` script

## Description

Create a pre-push hook that runs type-checking and tests before allowing pushes to remote. This catches type errors and test failures before they reach CI/CD, saving time and CI minutes.

## Files to Create

| File | Action | Purpose |
|------|--------|---------|
| `.husky/pre-push` | Create | Run `pnpm check-types` and `pnpm test` before pushing |

No existing files are modified by this task. The `.husky/pre-push` file does not exist yet.

## Implementation Details

### 1. Create `.husky/pre-push`

Create the file `.husky/pre-push` with the following content:

```sh
echo "🔍 Running type checks..."
pnpm check-types

echo "🧪 Running tests..."
pnpm test
```

Both commands use Turborepo (`turbo run check-types` and `turbo run test` respectively, via the root `package.json` scripts). Turborepo will run them across all packages defined in `turbo.json`.

### 2. Make it executable

```bash
chmod +x .husky/pre-push
```

### 3. Verify the file

```bash
cat .husky/pre-push
```

Expected output shows the two commands with echo statements.

## Acceptance Criteria

- `.husky/pre-push` file exists and is executable
- File contains `pnpm check-types` and `pnpm test` commands
- Running `pnpm check-types` manually succeeds (verifying the command is correct)
- Running `pnpm test` manually succeeds (verifying the command is correct)
- Attempting `git push` triggers the hook (type-check runs, then tests)

## Verification Commands

```bash
# Check file exists and is executable
ls -la .husky/pre-push

# View hook content
cat .husky/pre-push

# Verify the commands work independently
pnpm check-types
pnpm test

# Simulate a push without actually pushing (hook still runs)
# This is harder to test; the real verification is a git push
```

## Notes

- The pre-push hook runs on every push. For large codebases, `pnpm test` may take a while. This is acceptable because it prevents broken code from reaching CI.
- Both commands use Turborepo's caching — subsequent runs are faster.
- If `pnpm check-types` fails, `pnpm test` will NOT run (shell `&&` semantics). This is intentional: type errors should be fixed before running tests.
