# Task 01: Create @repo/vitest-config Package

## Status

complete

## Wave

1

## Description

Tạo package `packages/vitest-config/` (`@repo/vitest-config`) — một shared config package cung cấp các vitest preset để tái sử dụng trong toàn bộ monorepo. Package này là nền tảng: tất cả các package và app khác sẽ extends từ preset của nó. Cấu trúc tương tự như `@repo/typescript-config` và `@repo/tailwind-config`: một package chỉ chứa configuration, được export qua `package.json` exports field.

Ba preset chính:
- **base** — configuration chung cho mọi loại test (coverage provider, globals, v.v.)
- **node** — extends base, dành cho server-side packages (`@repo/env`, `@repo/db`, `@repo/auth`)
- **react** — extends base, dành cho React packages/apps (`@repo/ui`, `apps/tanstack-app`) với jsdom environment và `@vitejs/plugin-react`

## Dependencies

**Depends on:** None (Wave 1)
**Blocks:** task-03-wire-up-package-env, task-04-wire-up-package-db, task-05-wire-up-package-auth, task-06-wire-up-package-ui, task-07-wire-up-app-tanstack

**Context from dependencies:** Không có dependency — đây là task đầu tiên tạo package nền tảng.

## Files to Create

- `packages/vitest-config/package.json` — Package metadata, exports, dependencies
- `packages/vitest-config/tsconfig.json` — TypeScript config extend từ @repo/typescript-config/base.json
- `packages/vitest-config/src/base.ts` — Base vitest config (shared settings)
- `packages/vitest-config/src/node.ts` — Node environment vitest config
- `packages/vitest-config/src/react.ts` — React/jsdom environment vitest config
- `packages/vitest-config/src/index.ts` — Re-export tất cả presets

## Files to Modify

None.

## Technical Details

### Implementation Steps

1. Tạo thư mục `packages/vitest-config/src/`
2. Tạo `package.json` với exports map cho từng preset
3. Tạo `tsconfig.json` extend từ `@repo/typescript-config/base.json`
4. Tạo các preset config files trong `src/`
5. Chạy `pnpm install` từ root để link workspace package

### Code Snippets

**`packages/vitest-config/package.json`:**
```json
{
  "name": "@repo/vitest-config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./base": {
      "import": "./src/base.ts",
      "types": "./src/base.ts"
    },
    "./node": {
      "import": "./src/node.ts",
      "types": "./src/node.ts"
    },
    "./react": {
      "import": "./src/react.ts",
      "types": "./src/react.ts"
    },
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts"
    }
  },
  "scripts": {
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^6.0.1",
    "vitest": "^4.1.5"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@types/node": "^22.10.2",
    "typescript": "5.9.2"
  }
}
```

**`packages/vitest-config/tsconfig.json`:**
```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": false,
    "declarationMap": false,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**`packages/vitest-config/src/base.ts`:**
```ts
import type { UserConfig } from "vitest/config";

export const baseConfig: UserConfig = {
  test: {
    globals: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
};
```

**`packages/vitest-config/src/node.ts`:**
```ts
import { mergeConfig } from "vitest/config";
import { baseConfig } from "./base.js";

export const nodeConfig = mergeConfig(baseConfig, {
  test: {
    environment: "node",
  },
});
```

**`packages/vitest-config/src/react.ts`:**
```ts
import react from "@vitejs/plugin-react";
import { mergeConfig } from "vitest/config";
import { baseConfig } from "./base.js";

export const reactConfig = mergeConfig(baseConfig, {
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/vitest.setup.ts"],
  },
});
```

**`packages/vitest-config/src/index.ts`:**
```ts
export { baseConfig } from "./base.js";
export { nodeConfig } from "./node.js";
export { reactConfig } from "./react.js";
```

### Notes on Dependencies

- `vitest` nằm trong `dependencies` (không phải devDependencies) của `@repo/vitest-config` vì code trong package này import từ `vitest/config` và `vitest/config` cần mergeConfig. Theo pattern của monorepo, `@repo/tailwind-config` cũng có `tailwindcss` trong devDependencies và hoạt động tương tự.
- `@vitejs/plugin-react` cũng nằm trong `dependencies` vì `react.ts` import và sử dụng nó.
- Consumer packages KHÔNG cần cài `@vitejs/plugin-react` riêng — nó được resolve thông qua `@repo/vitest-config`.

### Workspace Registration

Package sẽ tự động được discover bởi pnpm workspace thông qua pattern `"packages/*"` trong `pnpm-workspace.yaml` — không cần sửa file đó.

## Acceptance Criteria

- [ ] `packages/vitest-config/package.json` tồn tại với `"name": "@repo/vitest-config"` và exports đầy đủ
- [ ] `packages/vitest-config/tsconfig.json` extend từ `@repo/typescript-config/base.json`
- [ ] `packages/vitest-config/src/base.ts` export `baseConfig` với coverage v8 provider
- [ ] `packages/vitest-config/src/node.ts` export `nodeConfig` merge từ base với node environment
- [ ] `packages/vitest-config/src/react.ts` export `reactConfig` merge từ base với jsdom + react plugin
- [ ] `packages/vitest-config/src/index.ts` re-export tất cả presets
- [ ] `pnpm install` chạy thành công và `@repo/vitest-config` có thể được resolve từ các package khác
- [ ] Package có script `check-types` chạy `tsc --noEmit`

## Notes

- Không dùng `globals: true` trong base config. Test files sẽ import explicit (`import { describe, it, expect } from "vitest"`) theo best practice — rõ ràng về dependency hơn.
- React preset mong đợi consumer có file `./src/vitest.setup.ts` — mỗi consumer tự tạo file này trong task của nó. File setup này thường import `@testing-library/jest-dom/vitest` (hoặc `@testing-library/jest-dom`).
- Module resolution: sử dụng `.js` extension trong import path (e.g. `"./base.js"`) vì project dùng ESM và `moduleResolution: "bundler"`.
