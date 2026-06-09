# Task 02: Configure Pre-commit Hook with lint-staged + Biome

## Status: complete

## Wave

Wave 2 — depends on Task 01 (Husky installed and `.husky/` directory exists)

## What Task 01 Provides

- `husky` and `lint-staged` are installed as dev dependencies
- `.husky/` directory exists with `.husky/pre-commit` file (currently a placeholder)
- Root `package.json` has `"prepare": "husky"` script

## Description

Configure the pre-commit hook to run Biome (`check --write`) on staged source files via lint-staged. This auto-fixes formatting and lint issues before they're committed, but only on changed files — keeping the hook fast.

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `.husky/pre-commit` | Overwrite | Run `lint-staged` when committing |
| `package.json` (root) | Modify | Add `"lint-staged"` configuration block |

## Implementation Details

### 1. Overwrite `.husky/pre-commit`

Replace the entire content of `.husky/pre-commit` with:

```sh
echo "🔍 Running lint-staged..."
npx lint-staged
```

The `echo` line provides visual feedback when the hook runs. `npx lint-staged` will automatically use the lint-staged installed as a dev dependency.

### 2. Add lint-staged config to root `package.json`

Add a `"lint-staged"` field at the top level of `package.json` (same level as `"scripts"` and `"devDependencies"`):

```json
"lint-staged": {
  "*.{ts,tsx,js,jsx,json,jsonc,css}": [
    "biome check --write --no-errors-on-unmatched"
  ]
}
```

The glob pattern `*.{ts,tsx,js,jsx,json,jsonc,css}` covers all source files in the repo. The `--no-errors-on-unmatched` flag prevents lint-staged from failing when no matching files are staged (e.g., staging only `.md` files).

Note: The root `biome.jsonc` already extends `@repo/biome-config` which has `files.includes` configured to ignore `node_modules`, `dist`, `.next`, etc., so Biome will only process valid source files.

### 3. Verify configuration

After both changes, the root `package.json` should have this structure (showing only relevant fields):

```json
{
  "scripts": {
    "prepare": "husky",
    ...
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx,json,jsonc,css}": [
      "biome check --write --no-errors-on-unmatched"
    ]
  },
  "devDependencies": {
    "husky": "^9.x.x",
    "lint-staged": "^15.x.x",
    ...
  }
}
```

## Acceptance Criteria

- `.husky/pre-commit` contains `npx lint-staged`
- `package.json` contains `"lint-staged"` config with the correct glob and `biome check --write` command
- Staging a `.ts` file with lint violations, then running `npx lint-staged` manually, fixes the issues
- The pre-commit hook does not run on non-matching file types (e.g., `.md`, `.sql`)
- Running `git commit` with staged source files triggers the hook

## Verification Commands

```bash
# Check the hook content
cat .husky/pre-commit

# Test lint-staged manually with a dry run
echo 'const x = 1' > /tmp/test-staged.ts
git add /tmp/test-staged.ts
npx lint-staged --dry-run

# Or test with a real staged change
# 1. Make a formatting error in any .ts file
# 2. git add that file
# 3. git commit -m "test: verify pre-commit hook"
```
