# Task 02: Configure Turborepo Tasks and Root Scripts

## Status

complete

## Wave

1

## Description

Thêm `test` và `test:watch` tasks vào `turbo.json` để Turborepo có thể orchestrate việc chạy test trên toàn bộ monorepo. Đồng thời thêm root-level scripts vào `package.json` để người dùng có thể chạy `pnpm test` hoặc `pnpm test:watch` từ root.

Task `test` nên có `dependsOn: ["^build"]` để đảm bảo tất cả internal dependencies được build trước khi test (một số package có thể cần build output của package khác). Task `test:watch` nên có `cache: false` và `persistent: true` vì watch mode chạy liên tục.

## Dependencies

**Depends on:** None (Wave 1)
**Blocks:** task-03-wire-up-package-env, task-04-wire-up-package-db, task-05-wire-up-package-auth, task-06-wire-up-package-ui, task-07-wire-up-app-tanstack

**Context from dependencies:** Không có dependency. Đây là task cấu hình root-level, chạy song song với task-01.

## Files to Create

None.

## Files to Modify

- `turbo.json` — Thêm `test` và `test:watch` vào `tasks`
- `package.json` (root) — Thêm `test` và `test:watch` vào `scripts`

## Technical Details

### Implementation Steps

1. Đọc `turbo.json` hiện tại
2. Thêm `"test"` và `"test:watch"` entries vào `tasks` object
3. Đọc root `package.json`
4. Thêm `"test": "turbo run test"` và `"test:watch": "turbo run test:watch"` vào `scripts`

### Code Snippets

**Thêm vào `turbo.json` > `tasks`:**

```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "inputs": ["$TURBO_DEFAULT$", ".env*"], "outputs": [".next/**", "!.next/cache/**"] },
    "check-types": { "dependsOn": ["^check-types"] },
    "dev": { "cache": false, "persistent": true },
    "db:generate": { "cache": false },
    "db:migrate": { "cache": false },
    "db:studio": { "cache": false },
    "test": { "dependsOn": ["^build"], "cache": true },
    "test:watch": { "cache": false, "persistent": true },
    "//#lint": {},
    "//#lint:fix": { "cache": false },
    "//#format": {},
    "//#format:fix": { "cache": false },
    "//#check": {},
    "//#check:fix": { "cache": false },
    "//#ci": {}
  }
}
```

Hai entries mới là:
- `"test"` — phụ thuộc vào `^build` (build của dependencies trước), có cache
- `"test:watch"` — không cache, persistent vì watch mode chạy liên tục

**Thêm vào root `package.json` > `scripts`:**

```json
"test": "turbo run test",
"test:watch": "turbo run test:watch"
```

Các scripts này sẽ chạy test/watch trên TẤT CẢ các package/app có script `test` hoặc `test:watch` trong `package.json` của chúng.

## Acceptance Criteria

- [ ] `turbo.json` có `"test"` task với `"dependsOn": ["^build"]` và `"cache": true`
- [ ] `turbo.json` có `"test:watch"` task với `"cache": false` và `"persistent": true`
- [ ] Root `package.json` có script `"test": "turbo run test"`
- [ ] Root `package.json` có script `"test:watch": "turbo run test:watch"`
- [ ] JSON syntax valid (có thể parse được)

## Notes

- Task `test` phụ thuộc vào `^build` (không phải `build`) — nghĩa là chỉ build các package mà package hiện tại phụ thuộc vào, không build chính package đó. Điều này đủ cho testing vì test code chạy trực tiếp từ source TypeScript, không cần build output của chính package đang test.
- Việc thêm scripts vào root `package.json` không ảnh hưởng đến các script hiện có.
- Các task root-level (`//#lint`, `//#ci`, v.v.) không bị ảnh hưởng.
