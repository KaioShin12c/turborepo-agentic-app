import path from "node:path";
import { reactConfig } from "@repo/vitest-config/react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  ...reactConfig,
  resolve: {
    alias: {
      // Mirror the "#/*" path alias from tsconfig.json so test files
      // can use the same import paths as application code.
      "#": path.resolve(__dirname, "./src"),
    },
  },
});
