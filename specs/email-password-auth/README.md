# Email Password Auth

## Overview

Implement real email/password registration with Better Auth in the TanStack app, backed by the existing Drizzle/PostgreSQL database package. The current signup page only validates locally and simulates loading; this feature adds the Better Auth schema, server configuration, auth route handler, client integration, and migration/verification workflow required for a working signup flow.

## Quick Links

- [Requirements](./requirements.md) — full requirements and acceptance criteria
- [Action Required](./action-required.md) — manual steps needing human action

## Dependency Graph

```mermaid
graph TD
    task-01-auth-dependencies-and-schema["01: Add Better Auth Dependencies and Schema"]
    task-02-server-auth-config-and-handler["02: Add Server Auth Config and API Handler"]
    task-03-client-signup-integration["03: Wire Signup Form to Better Auth Client"]
    task-04-migrations-and-verification["04: Generate Migrations and Verify"]
    task-01-auth-dependencies-and-schema --> task-02-server-auth-config-and-handler
    task-02-server-auth-config-and-handler --> task-03-client-signup-integration
    task-03-client-signup-integration --> task-04-migrations-and-verification
```

## Waves

| Wave | Tasks | Description |
|------|-------|-------------|
| 1 | task-01 | Add Better Auth packages and Drizzle schema foundation |
| 2 | task-02 | Configure Better Auth server and expose the auth API handler |
| 3 | task-03 | Connect the existing signup UI to `authClient.signUp.email` |
| 4 | task-04 | Generate database migrations, add migrate script, and run verification |

## Task Status

### Wave 1
- [x] [task-01-auth-dependencies-and-schema](./tasks/task-01-auth-dependencies-and-schema.md) — Add Better Auth dependencies and database schema

### Wave 2
- [x] [task-02-server-auth-config-and-handler](./tasks/task-02-server-auth-config-and-handler.md) — Add Better Auth server config and API route handler

### Wave 3
- [x] [task-03-client-signup-integration](./tasks/task-03-client-signup-integration.md) — Wire signup form to Better Auth client

### Wave 4
- [ ] [task-04-migrations-and-verification](./tasks/task-04-migrations-and-verification.md) — Generate migrations and verify the feature
