# Task 05: Wire Up Vitest in @repo/auth

## Status

pending

## Wave

2

## Description

Tích hợp Vitest vào `@repo/auth` package. Package này là Better Auth integration — export `auth` server instance và `authClient`. Đây là node-based package, sử dụng `nodeConfig` preset.

Viết sample test kiểm tra rằng auth server được cấu hình đúng (kiểm tra các option cơ bản của better-auth instance). Auth có dependency vào `@repo/db` và `@repo/env`, nhưng test này chỉ kiểm tra cấu trúc config, không cần database hoặc env thật nếu mock đúng cách.

## Dependencies

**Depends on:** task-01-create-vitest-config-package, task-02-configure-turborepo-tasks
**Blocks:** None

**Context from dependencies:**
- task-01 tạo `@repo/vitest-config` với `nodeConfig` preset. Import: `import { nodeConfig } from "@repo/vitest-config/node"`.
- task-02 thêm `test` task vào `turbo.json`.

## Files to Create

- `packages/auth/vitest.config.ts` — Vitest config sử dụng node preset
- `packages/auth/src/server.test.ts` — Sample test cho auth server config

## Files to Modify

- `packages/auth/package.json` — Thêm script `test`, `test:watch`, và devDependencies

## Technical Details

### Implementation Steps

1. Cập nhật `packages/auth/package.json`:
   - Thêm `"test": "vitest run"` và `"test:watch": "vitest"` vào `scripts`
   - Thêm `"@repo/vitest-config": "workspace:*"` và `"vitest": "^4.1.5"` vào `devDependencies`
2. Tạo `packages/auth/vitest.config.ts`
3. Tạo `packages/auth/src/server.test.ts` với sample test
4. Chạy `pnpm install`
5. Verify: `pnpm test --filter=@repo/auth`

### Code Snippets

**Cập nhật scripts trong `packages/auth/package.json`:**
```json
{
  "scripts": {
    "check-types": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

**Thêm vào devDependencies:**
```json
{
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@repo/vitest-config": "workspace:*",
    "@types/node": "^22.10.2",
    "typescript": "5.9.2",
    "vitest": "^4.1.5"
  }
}
```

**`packages/auth/vitest.config.ts`:**
```ts
import { defineConfig } from "vitest/config";
import { nodeConfig } from "@repo/vitest-config/node";

export default defineConfig(nodeConfig);
```

**`packages/auth/src/server.test.ts`:**
```ts
import { describe, expect, it, vi } from "vitest";

// Mock database and env dependencies before importing auth
vi.mock("@repo/db", () => ({
  db: {},
}));

vi.mock("@repo/env", () => ({
  env: {
    BETTER_AUTH_SECRET: "test-secret-for-unit-tests",
    BETTER_AUTH_URL: "http://localhost:3000",
    GITHUB_CLIENT_ID: "test-client-id",
    GITHUB_CLIENT_SECRET: "test-client-secret",
    DATABASE_URL: "postgres://localhost:5432/test",
  },
}));

describe("@repo/auth server", () => {
  it("should export auth instance", async () => {
    const { auth } = await import("./server.js");
    expect(auth).toBeDefined();
    // better-auth instance has an $context property
    expect(auth).toHaveProperty("handler");
    expect(typeof auth.handler).toBe("function");
  });

  it("should export AuthSession type", async () => {
    const { AuthSession } = await import("./server.js");
    expect(AuthSession).toBeDefined();
  });
});
```

## Acceptance Criteria

- [ ] `packages/auth/package.json` có script `"test": "vitest run"` và `"test:watch": "vitest"`
- [ ] `packages/auth/package.json` có `@repo/vitest-config` và `vitest` trong devDependencies
- [ ] `packages/auth/vitest.config.ts` tồn tại và import `nodeConfig`
- [ ] `packages/auth/src/server.test.ts` tồn tại với test kiểm tra auth instance
- [ ] `pnpm test --filter=@repo/auth` chạy thành công

## Notes

- Cần mock `@repo/db` và `@repo/env` vì `server.ts` import chúng. Mock phải được khai báo TRƯỚC khi import `server.ts`.
- `vi.mock` được hoisted bởi vitest lên đầu file, nên thứ tự khai báo không quan trọng. Tuy nhiên, dùng `await import("./server.js")` dynamic import là pattern an toàn nhất.
- Test này kiểm tra rằng auth server được export và có `handler` function — không test full auth flow (integration test sẽ test sau nếu cần).
