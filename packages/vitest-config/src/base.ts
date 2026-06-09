import { defineConfig } from "vitest/config";

export const baseConfig = defineConfig({
  test: {
    // Explicit import pattern — no globals injection for clarity
    globals: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
