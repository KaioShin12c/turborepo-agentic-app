# Task 01: Add Better Auth Dependencies and Schema

## Status

complete

## Wave

1

## Description

Add the package dependencies and database schema foundation needed for Better Auth email/password registration. The current database package only defines a simple `users` table with a serial ID, which does not match Better Auth's required core schema. This task prepares Drizzle schema exports for Better Auth's `user`, `session`, `account`, and `verification` models so later tasks can configure the server and API handler.

## Dependencies

**Depends on:** None (Wave 1)
**Blocks:** task-02-server-auth-config-and-handler.md

**Context from dependencies:** This is the foundation task. Later tasks will import the schema and `db` connection from `@repo/db` and pass them to Better Auth's Drizzle adapter.

## Files to Create

- None expected.

## Files to Modify

- `apps/tanstack-app/package.json` — add Better Auth runtime dependency for the app package.
- `packages/db/package.json` — add Better Auth Drizzle adapter dependency where the DB integration lives, or ensure dependencies are available to the app package if the server config imports directly there.
- `packages/db/src/schema.ts` — replace or extend the existing schema with Better Auth-compatible tables.
- `packages/db/src/index.ts` — ensure schema exports remain available and `db` still initializes with the full schema object.

## Technical Details

### Implementation Steps

1. Add Better Auth dependencies using pnpm workspace filters. Prefer commands equivalent to `pnpm --filter tanstack-app add better-auth` and `pnpm --filter @repo/db add @better-auth/drizzle-adapter`.
2. Review the resulting dependency placement. If the Better Auth server config lives inside `apps/tanstack-app`, `@better-auth/drizzle-adapter` may also need to be available to `tanstack-app`; choose the smallest dependency layout that works with package boundaries and TypeScript resolution.
3. Update `packages/db/src/schema.ts` to define Better Auth core tables. Better Auth's core schema requires `user`, `session`, `account`, and `verification` models.
4. Preserve `packages/db/src/index.ts` behavior: it must still export all schema symbols and create `db = drizzle(client, { schema })`.
5. Prefer Better Auth's expected model/table names (`user`, `session`, `account`, `verification`) to avoid custom mapping complexity unless there is a strong reason to preserve the old plural `users` table.
6. If replacing the old `users` table, note that this may affect existing sample data. There are no known external consumers in the planning context.

### Code Snippets

Use Drizzle PostgreSQL core primitives. A compatible manual schema should be close to this shape:

```ts
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

Better Auth documentation also supports using `pnpm dlx auth@latest generate --config <path> --output <path>` for generating Drizzle schema. If using generated output, merge carefully into `packages/db/src/schema.ts` instead of creating an unmanaged second schema file.

### Environment Variables

- `DATABASE_URL` — already required by `packages/db/src/index.ts` and `packages/db/drizzle.config.ts`.

### API Endpoints

None in this task.

## Acceptance Criteria

- [ ] `better-auth` is installed where client/server app code can import it.
- [ ] `@better-auth/drizzle-adapter` is installed where server auth config can import it.
- [ ] `packages/db/src/schema.ts` exports Better Auth-compatible `user`, `session`, `account`, and `verification` tables.
- [ ] `packages/db/src/index.ts` continues to export schema symbols and instantiate Drizzle with the complete schema.
- [ ] No `drizzle push` usage is added.

## Notes

Better Auth's Drizzle adapter docs specify `drizzleAdapter(db, { provider: "pg" })` for PostgreSQL. If custom table names are used, the adapter needs schema/model mapping; using default singular names is simpler and preferred for this feature.
