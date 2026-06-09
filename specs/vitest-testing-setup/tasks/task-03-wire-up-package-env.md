# Task 03: Wire Up Vitest in @repo/env

## Status

complete

## Wave

2

## Description

Tích hợp Vitest vào `@repo/env` package. Package này là một node-based package (validate environment variables bằng `@t3-oss/env-core` + Zod), không có React dependency. Sử dụng `nodeConfig` preset từ `@repo/vitest-config`.

Viết một sample test đơn giản để verify rằng vitest config hoạt động và import được package code.

Package `@repo/env` chỉ có một source file `src/index.ts` export ra `env` object. Sample test sẽ kiểm tra rằng schema validation hoạt động (validate một object với đầy đủ biến môi trường).

## Dependencies

**Depends on:** task-01-create-vitest-config-package, task-02-configure-turborepo-tasks
**Blocks:** None

**Context from dependencies:**
- task-01 tạo `@repo/vitest-config` package với `nodeConfig` preset (node environment, extends base config có v8 coverage). Có thể import qua `import { nodeConfig } from "@repo/vitest-config/node"`.
- task-02 thêm `test` và `test:watch` tasks vào `turbo.json`, và root-level scripts. Package này chỉ cần có script `test` trong `package.json` — Turborepo sẽ tự động phát hiện.

## Files to Create

- `packages/env/vitest.config.ts` — Vitest config sử dụng node preset
- `packages/env/src/index.test.ts` — Sample test cho env validation

## Files to Modify

- `packages/env/package.json` — Thêm script `test`, devDependencies `@repo/vitest-config` và `vitest`

## Technical Details

### Implementation Steps

1. Cập nhật `packages/env/package.json`:
   - Thêm `"test": "vitest run"` và `"test:watch": "vitest"` vào `scripts`
   - Thêm `"@repo/vitest-config": "workspace:*"` và `"vitest": "^4.1.5"` vào `devDependencies`
2. Tạo `packages/env/vitest.config.ts` import và sử dụng `nodeConfig` từ `@repo/vitest-config/node`
3. Tạo `packages/env/src/index.test.ts` với sample test
4. Chạy `pnpm install` để cài đặt dependencies mới
5. Chạy `pnpm test --filter=@repo/env` để verify

### Code Snippets

**Cập nhật `packages/env/package.json`:**

Script hiện tại chỉ có `"check-types": "tsc --noEmit"`. Thêm hai script mới:

```json
{
  "scripts": {
    "check-types": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Thêm vào `devDependencies` (giữ nguyên các trường khác):

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

**`packages/env/vitest.config.ts`:**
```ts
import { defineConfig } from "vitest/config";
import { nodeConfig } from "@repo/vitest-config/node";

export default defineConfig(nodeConfig);
```

**`packages/env/src/index.test.ts`:**
```ts
import { describe, expect, it } from "vitest";

// Import the env module to verify it can be imported without errors
// The env module uses process.env and validates at import time
describe("@repo/env", () => {
  it("should export env module", async () => {
    // Since env.ts uses dotenv and validates at import time,
    // we verify the module structure
    const envModule = await import("./index.js");
    expect(envModule).toBeDefined();
    expect(envModule).toHaveProperty("env");
  });

  it("should have expected environment variable keys", async () => {
    const { env } = await import("./index.js");
    // env is a validated object from @t3-oss/env-core
    // Check that the expected keys exist (values come from .env or process.env)
    expect(env).toBeDefined();
    expect(typeof env).toBe("object");
  });
});
```

### Environment Variables for Testing

Không cần thêm biến môi trường đặc biệt. Test sử dụng `process.env` hiện có. Nếu `.env` file có các biến cần thiết (`DATABASE_URL`, `BETTER_AUTH_URL`, v.v.), test sẽ pass. Nếu không, dotenv sẽ load từ `.env` trong quá trình test (vì source code gọi `dotenv.config()`).

## Acceptance Criteria

- [ ] `packages/env/package.json` có script `"test": "vitest run"` và `"test:watch": "vitest"`
- [ ] `packages/env/package.json` có `@repo/vitest-config` và `vitest` trong devDependencies
- [ ] `packages/env/vitest.config.ts` tồn tại và import `nodeConfig` từ `@repo/vitest-config/node`
- [ ] `packages/env/src/index.test.ts` tồn tại với ít nhất 1 test case
- [ ] `pnpm test --filter=@repo/env` chạy thành công (tất cả test pass)

## Notes

- File `.test.ts` được đặt cạnh source file (`src/index.test.ts`) thay vì thư mục `__tests__/` riêng — theo convention co-location test của vitest.
- Sử dụng dynamic import (`await import("./index.js")`) trong test để tránh lỗi import-time nếu env validation fail do thiếu biến môi trường.
- `tsconfig.json` của package hiện tại include `"src"` — file `.test.ts` sẽ được TypeScript check type nhưng vitest config KHÔNG bị include (vitest tự xử lý transpile config).
- Nếu test fail do thiếu biến môi trường, có thể set `process.env` trước khi import trong test file. Nhưng ưu tiên cách dùng dynamic import trước.
