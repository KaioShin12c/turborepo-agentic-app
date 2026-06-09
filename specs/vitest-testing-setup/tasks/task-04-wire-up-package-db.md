# Task 04: Wire Up Vitest in @repo/db

## Status

pending

## Wave

2

## Description

Tích hợp Vitest vào `@repo/db` package. Package này là database layer sử dụng Drizzle ORM + PostgreSQL (`pg`). Đây là node-based package, sử dụng `nodeConfig` preset.

Viết sample test cho schema validation — kiểm tra rằng Drizzle schema được định nghĩa đúng (các bảng `user`, `session`, `account`, `verification` có columns mong đợi). Không cần kết nối database thật (unit test schema structure).

## Dependencies

**Depends on:** task-01-create-vitest-config-package, task-02-configure-turborepo-tasks
**Blocks:** None

**Context from dependencies:**
- task-01 tạo `@repo/vitest-config` với `nodeConfig` preset. Import: `import { nodeConfig } from "@repo/vitest-config/node"`.
- task-02 thêm `test` task vào `turbo.json`. Package chỉ cần có script `test` — Turborepo tự phát hiện.

## Files to Create

- `packages/db/vitest.config.ts` — Vitest config sử dụng node preset
- `packages/db/src/schema.test.ts` — Sample test cho Drizzle schema

## Files to Modify

- `packages/db/package.json` — Thêm script `test`, `test:watch`, và devDependencies

## Technical Details

### Implementation Steps

1. Cập nhật `packages/db/package.json`:
   - Thêm `"test": "vitest run"` và `"test:watch": "vitest"` vào `scripts`
   - Thêm `"@repo/vitest-config": "workspace:*"` và `"vitest": "^4.1.5"` vào `devDependencies`
2. Tạo `packages/db/vitest.config.ts`
3. Tạo `packages/db/src/schema.test.ts` với test kiểm tra schema structure
4. Chạy `pnpm install`
5. Verify: `pnpm test --filter=@repo/db`

### Code Snippets

**Cập nhật `packages/db/package.json` scripts:**
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

**Thêm vào devDependencies:**
```json
{
  "devDependencies": {
    "@repo/vitest-config": "workspace:*",
    "@types/node": "^25.9.1",
    "@types/pg": "^8.20.0",
    "drizzle-kit": "^0.31.10",
    "tsx": "^4.22.4",
    "typescript": "^5.0.0",
    "vitest": "^4.1.5"
  }
}
```

**`packages/db/vitest.config.ts`:**
```ts
import { defineConfig } from "vitest/config";
import { nodeConfig } from "@repo/vitest-config/node";

export default defineConfig(nodeConfig);
```

**`packages/db/src/schema.test.ts`:**
```ts
import { describe, expect, it } from "vitest";
import * as schema from "./schema.js";

describe("@repo/db schema", () => {
  it("should export user table", () => {
    expect(schema.user).toBeDefined();
    // Drizzle pgTable has specific internal symbols for column definitions
    expect(schema.user).toHaveProperty("id");
    expect(schema.user).toHaveProperty("name");
    expect(schema.user).toHaveProperty("email");
    expect(schema.user).toHaveProperty("emailVerified");
    expect(schema.user).toHaveProperty("image");
    expect(schema.user).toHaveProperty("createdAt");
    expect(schema.user).toHaveProperty("updatedAt");
  });

  it("should export session table", () => {
    expect(schema.session).toBeDefined();
    expect(schema.session).toHaveProperty("id");
    expect(schema.session).toHaveProperty("expiresAt");
    expect(schema.session).toHaveProperty("token");
    expect(schema.session).toHaveProperty("ipAddress");
    expect(schema.session).toHaveProperty("userAgent");
    expect(schema.session).toHaveProperty("userId");
  });

  it("should export account table", () => {
    expect(schema.account).toBeDefined();
    expect(schema.account).toHaveProperty("id");
    expect(schema.account).toHaveProperty("accountId");
    expect(schema.account).toHaveProperty("providerId");
    expect(schema.account).toHaveProperty("userId");
  });

  it("should export verification table", () => {
    expect(schema.verification).toBeDefined();
    expect(schema.verification).toHaveProperty("id");
    expect(schema.verification).toHaveProperty("identifier");
    expect(schema.verification).toHaveProperty("value");
    expect(schema.verification).toHaveProperty("expiresAt");
  });
});
```

## Acceptance Criteria

- [ ] `packages/db/package.json` có script `"test": "vitest run"` và `"test:watch": "vitest"`
- [ ] `packages/db/package.json` có `@repo/vitest-config` và `vitest` trong devDependencies
- [ ] `packages/db/vitest.config.ts` tồn tại và import `nodeConfig`
- [ ] `packages/db/src/schema.test.ts` tồn tại với tests kiểm tra 4 bảng (user, session, account, verification)
- [ ] `pnpm test --filter=@repo/db` chạy thành công

## Notes

- Schema file hiện tại import từ `@repo/env` (để lấy DATABASE_URL). Điều này có thể gây lỗi nếu env không được set. Tuy nhiên, Drizzle schema definition (`pgTable(...)`) không cần database connection — chỉ khi thực thi query mới cần. Nên schema tests có thể import schema mà không cần env.
- Nếu schema.ts có code import-time cần env, có thể cần mock `@repo/env` trước khi import. Dùng `vi.mock` nếu cần.
- File `drizzle.config.ts` sẽ không bị include trong test run vì nó ở ngoài `src/`.
