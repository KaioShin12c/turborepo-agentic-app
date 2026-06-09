# Action Required: Setup Husky

## Before Implementation

No manual steps required. All changes are local to the repository.

## During Implementation

No manual steps required.

## After Implementation

1. **Verify hooks are active**: After `pnpm install`, run `ls -la .husky/` to confirm hook files exist and are executable
2. **Test pre-commit**: Stage a file with a formatting issue, attempt `git commit` — the hook should auto-fix and succeed
3. **Test pre-push**: Push a branch — the hook should run type-check and tests before allowing the push
4. **Team communication**: Notify the team that git hooks are now active. They should run `pnpm install` to get the new hooks set up automatically
