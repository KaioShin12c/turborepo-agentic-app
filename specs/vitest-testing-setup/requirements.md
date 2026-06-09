# Requirements: Vitest Testing Setup

## Summary

Dự án hiện tại là turborepo monorepo không có bất kỳ test framework hoặc test file nào. Mặc dù `apps/tanstack-app` đã có `vitest` trong devDependencies, nhưng chưa có config file (`vitest.config.ts`) và chưa có bất kỳ test file nào. Các package khác (`@repo/env`, `@repo/db`, `@repo/auth`, `@repo/ui`) hoàn toàn chưa có testing.

Mục tiêu là triển khai Vitest làm testing framework chuẩn cho toàn bộ monorepo. Core của giải pháp là một shared config package (`@repo/vitest-config`) cung cấp các preset config tái sử dụng — tương tự như cách `@repo/typescript-config` cung cấp shared tsconfig presets. Điều này đảm bảo mọi package và app trong monorepo có cùng một base test configuration, và bất kỳ package/app mới nào trong tương lai cũng có thể dễ dàng tích hợp testing.

## Goals

- Tạo `@repo/vitest-config` package với các preset: base (global config), node (cho server-side packages), react (cho React packages/apps với jsdom)
- Tích hợp vitest vào tất cả các package hiện có: `@repo/env`, `@repo/db`, `@repo/auth`, `@repo/ui`
- Tích hợp vitest vào `apps/tanstack-app` với config jsdom/react
- Thêm `test` và `test:watch` tasks vào `turbo.json` để chạy song song toàn bộ monorepo test
- Thêm root-level scripts `test` và `test:watch` chạy qua Turborepo
- Tuân thủ các pattern hiện có trong monorepo: package naming (`@repo/*`), TypeScript config extends pattern, turborepo task pipeline

## Non-Goals

- Viết test code cho từng package cụ thể (chỉ thiết lập infrastructure và viết 1 sample test tối thiểu để verify)
- Unit test coverage targets hoặc CI integration (có thể thêm sau)
- E2E testing (playwright, cypress)
- Integration test với database thật (chỉ node unit test)
- Snapshot testing

## Acceptance Criteria

- [ ] `packages/vitest-config/` tồn tại với `package.json`, `tsconfig.json`, và các preset config files
- [ ] `@repo/vitest-config` export được các preset: base, node, react thông qua package.json exports
- [ ] `turbo.json` có `test` và `test:watch` tasks
- [ ] Root `package.json` có `test` và `test:watch` scripts chạy qua `turbo run`
- [ ] `@repo/env` có `vitest.config.ts`, script `test`, và ít nhất 1 sample test pass
- [ ] `@repo/db` có `vitest.config.ts`, script `test`, và ít nhất 1 sample test pass
- [ ] `@repo/auth` có `vitest.config.ts`, script `test`, và ít nhất 1 sample test pass
- [ ] `@repo/ui` có `vitest.config.ts`, script `test`, và ít nhất 1 sample test pass
- [ ] `apps/tanstack-app` có `vitest.config.ts`, script `test`, và ít nhất 1 sample test pass
- [ ] `pnpm test` từ root chạy thành công tất cả test trên toàn monorepo

## Assumptions

- Vitest v4.x API tương thích với các phiên bản hiện tại đã cài trong `apps/tanstack-app` (vitest ^4.1.5)
- pnpm workspace hoisting cho phép resolve vitest từ root node_modules khi các package import từ `vitest/config`
- Các package node-based (`env`, `db`, `auth`) không cần jsdom — chỉ cần node environment
- `@repo/ui` và `apps/tanstack-app` cần jsdom environment cho React component testing
- TypeScript config cho vitest config files sẽ không được include trong tsconfig của package (vitest tự xử lý transpile config files)

## Technical Constraints

- Sử dụng `vitest ^4.1.5` (cùng version đã có trong `apps/tanstack-app`)
- Package naming: `@repo/vitest-config` (tuân thủ convention `@repo/*`)
- tsconfig extends pattern: sử dụng `@repo/typescript-config/base.json` làm base
- Module system: ESM (`"type": "module"`) nhất quán với các package hiện có
- Turborepo task pipeline: `test` task depends on `^build` để đảm bảo dependencies được build trước khi test
- Không sử dụng `vitest globals` injection trong test files (explicit import pattern để rõ ràng)
- Vitest config files sử dụng `defineConfig` từ `vitest/config` và `mergeConfig` để compose presets
