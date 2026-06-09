# Setup Husky

Configure Husky git hooks for automated pre-commit and pre-push quality checks.

## Dependency Graph

```
Task 01 (Install & Init)
  ├── Task 02 (Pre-commit hook)
  └── Task 03 (Pre-push hook)
```

## Wave Table

| Wave | Tasks | Description |
|------|-------|-------------|
| 1 | task-01 | Install Husky + lint-staged, initialize `.husky/` directory |
| 2 | task-02, task-03 | Pre-commit hook (Biome via lint-staged) + Pre-push hook (type-check + test) |

Tasks 02 and 03 touch separate files within `.husky/` — safe for parallel execution.

## Status Tracking

| Task | Status | Assigned To |
|------|--------|-------------|
| task-01-install-husky | complete | coder |
| task-02-pre-commit-hook | complete | coder |
| task-03-pre-push-hook | complete | coder |
