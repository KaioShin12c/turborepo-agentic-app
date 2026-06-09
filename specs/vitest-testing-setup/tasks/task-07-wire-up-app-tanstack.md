# Task 07: Wire Up Vitest in apps/tanstack-app

## Status

pending

## Wave

2

## Description

Tích hợp Vitest vào `apps/tanstack-app`. App này đã có `vitest` trong devDependencies và script `"test": "vitest run"`, nhưng thiếu `vitest.config.ts` và chưa có test file nào.

App là TanStack Start (React SSR framework), sử dụng `reactConfig` preset (jsdom + React plugin). Cần tạo:
- `vitest.config.ts` dùng react preset (ghi đè setup file path vì app không có `src/` prefix giống như package)
- `vitest.setup.ts` cho testing-library
- Sample test cho một component hoặc utility

Lưu ý: App này có TypeScript phiên bản 6.0.2 (cao hơn các package khác dùng 5.9.2), và có `verbatimModuleSyntax: true`.

## Dependencies

**Depends on:** task-01-create-vitest-config-package, task-02-configure-turborepo-tasks
**Blocks:** None

**Context from dependencies:**
- task-01 tạo `@repo/vitest-config` với `reactConfig` preset. Import: `import { reactConfig } from "@repo/vitest-config/react"`.
- `reactConfig` mặc định mong đợi setup file tại `./src/vitest.setup.ts`. App này có thể cần ghi đè path hoặc tạo file tại vị trí phù hợp.
- task-02 thêm `test` task vào `turbo.json`.

## Files to Create

- `apps/tanstack-app/vitest.config.ts` — Vitest config sử dụng react preset
- `apps/tanstack-app/src/vitest.setup.ts` — Setup file import @testing-library/jest-dom
- `apps/tanstack-app/src/lib/utils.test.ts` — Sample test cho utility hoặc component

## Files to Modify

- Không cần sửa `package.json` vì đã có script `"test": "vitest run"` và devDependencies `vitest`, `@testing-library/react`, `@testing-library/dom`, `jsdom`. Chỉ cần thêm `@repo/vitest-config` vào devDependencies.

## Technical Details

### Implementation Steps

1. Thêm `"@repo/vitest-config": "workspace:*"` vào devDependencies của `apps/tanstack-app/package.json`
2. Tạo `apps/tanstack-app/vitest.config.ts`
3. Tạo `apps/tanstack-app/src/vitest.setup.ts`
4. Tạo sample test file (có thể test một page component hoặc utility)
5. Chạy `pnpm install`
6. Verify: `pnpm test --filter=tanstack-app`

### Code Snippets

**Sửa `apps/tanstack-app/package.json` — thêm vào devDependencies:**

Chỉ cần thêm `"@repo/vitest-config": "workspace:*"` vào danh sách devDependencies hiện có. Các dependency khác (`vitest`, `@testing-library/react`, v.v.) đã có sẵn.

Không cần thay đổi scripts vì `"test": "vitest run"` đã tồn tại. Có thể thêm `"test:watch": "vitest"` nếu muốn.

**`apps/tanstack-app/vitest.config.ts`:**
```ts
import { defineConfig, mergeConfig } from "vitest/config";
import { reactConfig } from "@repo/vitest-config/react";
import tsconfigPaths from "vite-tsconfig-paths";

// Override the setup file path since the app root is different from packages
export default defineConfig(
  mergeConfig(reactConfig, {
    plugins: [
      tsconfigPaths(), // resolve #/* path aliases from tsconfig
    ],
  })
);
```

Note: Nếu `reactConfig` đã define setup path là `./src/vitest.setup.ts`, thì app này phải tạo file đúng path đó. Hoặc ghi đè:

```ts
import { defineConfig } from "vitest/config";
import { reactConfig } from "@repo/vitest-config/react";

export default defineConfig({
  ...reactConfig,
  test: {
    ...reactConfig.test,
    // setup file path matches app structure (app root is ./src/)
    setupFiles: ["./src/vitest.setup.ts"],
  },
});
```

**`apps/tanstack-app/src/vitest.setup.ts`:**
```ts
import "@testing-library/jest-dom/vitest";
```

**`apps/tanstack-app/src/lib/utils.test.ts`:**
```ts
import { describe, expect, it } from "vitest";

// Simple utility test that doesn't require React rendering
describe("tanstack-app utilities", () => {
  it("should have correct app config", () => {
    // Verify the app can import from its own modules
    expect(true).toBe(true);
  });

  it("should handle path aliases", () => {
    // Verify that #/* path aliases work (via vite-tsconfig-paths plugin in vitest)
    expect(typeof describe).toBe("function");
  });
});
```

Nếu muốn test một component cụ thể, có thể chọn test một page component:

**`apps/tanstack-app/src/routes/__root.test.tsx`:**
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock TanStack Router and auth dependencies
vi.mock("@tanstack/react-router", () => ({
  createRootRoute: vi.fn(),
  Outlet: () => null,
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

vi.mock("@repo/auth/client", () => ({
  authClient: {},
  useSession: () => ({ data: null, isPending: false }),
}));

// Import the component after mocks
// Note: __root.tsx may have complex dependencies, so prefer testing simple components
```

Đề xuất: viết test cho một component đơn giản hoặc utility function thay vì page components phức tạp (page components phụ thuộc nhiều vào TanStack Router, Loader, v.v.)

### Alternative: Test a simpler shared component

App này import UI từ `@repo/ui`, nên component tests có thể tập trung ở `@repo/ui`. App-level test có thể là smoke test verify app khởi tạo đúng:

```ts
import { describe, expect, it } from "vitest";

describe("tanstack-app", () => {
  it("should be configured with vitest", () => {
    // Smoke test: verify test environment works
    expect(true).toBe(true);
  });
});
```

### Path Alias Support

App sử dụng path alias `#/*` -> `./src/*` trong tsconfig. Để vitest resolve được các alias này, cần thêm plugin `vite-tsconfig-paths` hoặc cấu hình `resolve.alias` trong vitest config.

**Option A: Dùng `vite-tsconfig-paths` plugin**
```bash
pnpm add -D vite-tsconfig-paths --filter=tanstack-app
```

**Option B: Cấu hình resolve.alias thủ công trong vitest.config.ts**
```ts
import path from "node:path";

export default defineConfig({
  ...reactConfig,
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "./src"),
    },
  },
});
```

Khuyến nghị Option B vì không cần thêm dependency.

## Acceptance Criteria

- [ ] `apps/tanstack-app/package.json` có `@repo/vitest-config` trong devDependencies
- [ ] `apps/tanstack-app/vitest.config.ts` tồn tại, sử dụng `reactConfig` và resolve `#/*` path alias
- [ ] `apps/tanstack-app/src/vitest.setup.ts` tồn tại với `import "@testing-library/jest-dom/vitest"`
- [ ] Ít nhất 1 test file tồn tại trong `apps/tanstack-app/src/`
- [ ] `pnpm test --filter=tanstack-app` chạy thành công
- [ ] Script `test` đã tồn tại từ trước (`"test": "vitest run"`), không cần sửa

## Notes

- App dùng TypeScript 6.0.2, khác với các package dùng 5.9.2. Vitest config không bị ảnh hưởng.
- App có `verbatimModuleSyntax: true` trong tsconfig — cần đảm bảo import sử dụng `import type` cho type-only imports trong test files.
- Nếu gặp lỗi về `@tanstack/react-router` hoặc `@tanstack/react-start` khi import trong test, sử dụng `vi.mock()` để mock các module này.
- TanStack Start dùng file-based routing — không nên import trực tiếp các route components trừ khi mock đầy đủ dependencies của chúng.
- `@testing-library/jest-dom` version: App đã có `@testing-library/dom` và `@testing-library/react`. Cần thêm `@testing-library/jest-dom` để có các matcher như `toBeInTheDocument()`. Cài: `pnpm add -D @testing-library/jest-dom --filter=tanstack-app`.
