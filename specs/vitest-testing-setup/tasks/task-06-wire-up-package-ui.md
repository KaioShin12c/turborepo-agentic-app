# Task 06: Wire Up Vitest in @repo/ui

## Status

pending

## Wave

2

## Description

Tích hợp Vitest vào `@repo/ui` package. Đây là shared UI component library (React + shadcn/ui). Sử dụng `reactConfig` preset (jsdom environment + React plugin).

Cần tạo:
- `vitest.config.ts` dùng react preset
- `vitest.setup.ts` để setup testing-library matchers
- Sample test render một component đơn giản (vd: `Button`)

Package `@repo/ui` đã có sẵn React và React DOM trong dependencies, nhưng chưa có testing-library hoặc jsdom.

## Dependencies

**Depends on:** task-01-create-vitest-config-package, task-02-configure-turborepo-tasks
**Blocks:** None

**Context from dependencies:**
- task-01 tạo `@repo/vitest-config` với `reactConfig` preset (jsdom, react plugin, setup file path `./src/vitest.setup.ts`). Import: `import { reactConfig } from "@repo/vitest-config/react"`.
- `reactConfig` mong đợi file setup tại `./src/vitest.setup.ts` — phải tạo file này.
- task-02 thêm `test` task vào `turbo.json`.

## Files to Create

- `packages/ui/vitest.config.ts` — Vitest config sử dụng react preset
- `packages/ui/src/vitest.setup.ts` — Setup file import @testing-library/jest-dom
- `packages/ui/src/components/ui/button.test.tsx` — Sample component test

## Files to Modify

- `packages/ui/package.json` — Thêm script `test`, `test:watch`, và devDependencies

## Technical Details

### Implementation Steps

1. Cập nhật `packages/ui/package.json`:
   - Thêm `"test": "vitest run"` và `"test:watch": "vitest"` vào `scripts`
   - Thêm devDependencies: `@repo/vitest-config`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/dom`, `jsdom`
2. Tạo `packages/ui/vitest.config.ts`
3. Tạo `packages/ui/src/vitest.setup.ts`
4. Tạo `packages/ui/src/components/ui/button.test.tsx` — render test cho Button component
5. Chạy `pnpm install`
6. Verify: `pnpm test --filter=@repo/ui`

### Code Snippets

**Cập nhật scripts trong `packages/ui/package.json`:**
```json
{
  "scripts": {
    "generate:component": "turbo gen react-component",
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
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/node": "^22.15.3",
    "@types/react": "19.2.2",
    "@types/react-dom": "19.2.2",
    "jsdom": "^28.1.0",
    "typescript": "5.9.2",
    "vitest": "^4.1.5"
  }
}
```

**`packages/ui/vitest.config.ts`:**
```ts
import { defineConfig } from "vitest/config";
import { reactConfig } from "@repo/vitest-config/react";

export default defineConfig(reactConfig);
```

**`packages/ui/src/vitest.setup.ts`:**
```ts
import "@testing-library/jest-dom/vitest";
```

**`packages/ui/src/components/ui/button.test.tsx`:**
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button.js";

describe("Button", () => {
  it("should render with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("should apply variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toBeInTheDocument();
    // Verify it has a class (button component uses cva for variants)
    expect(button.className).toBeTruthy();
  });

  it("should render as a child element when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    expect(screen.getByRole("link", { name: "Link Button" })).toBeInTheDocument();
  });
});
```

### Environment Variables

Không cần thêm biến môi trường. jsdom được cấu hình trong `reactConfig` preset.

## Acceptance Criteria

- [ ] `packages/ui/package.json` có script `"test": "vitest run"` và `"test:watch": "vitest"`
- [ ] `packages/ui/package.json` có đầy đủ devDependencies: `@repo/vitest-config`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- [ ] `packages/ui/vitest.config.ts` tồn tại và import `reactConfig` từ `@repo/vitest-config/react`
- [ ] `packages/ui/src/vitest.setup.ts` tồn tại với `import "@testing-library/jest-dom/vitest"`
- [ ] `packages/ui/src/components/ui/button.test.tsx` tồn tại với ít nhất 2 test cases
- [ ] `pnpm test --filter=@repo/ui` chạy thành công (tất cả test pass)

## Notes

- `@testing-library/jest-dom/vitest` là phiên bản tương thích với vitest (thay vì `@testing-library/jest-dom` dùng cho jest). Cung cấp các matcher như `toBeInTheDocument()`, `toHaveTextContent()`, v.v.
- UI components sử dụng `cva` (class-variance-authority) và `lucide-react` icons — cả hai đều hoạt động trong jsdom environment mà không cần mock đặc biệt.
- Button component có thể sử dụng các Radix UI primitive (`@radix-ui/react-slot` cho `asChild`) — đảm bảo các dependency này được resolve trong test environment.
- File test đặt trong `src/components/ui/` cạnh component, theo co-location pattern.
