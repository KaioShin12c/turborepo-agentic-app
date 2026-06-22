import path from "node:path";
import { reactConfig } from "@repo/vitest-config/react";
import { defineConfig, mergeConfig } from "vitest/config";

const projectConfig = defineConfig({
  test: {
    setupFiles: ["./src/vitest.setup.ts"],
  },
  resolve: {
    alias: {
      // Mirror the "#/*" path alias from tsconfig.json so test files
      // can use the same import paths as application code.
      "#": path.resolve(__dirname, "./src"),
      // Resolve @repo/ui's internal "src/" imports (e.g. "src/lib/utils")
      // so that UI components can be transformed in the app's vitest context.
      src: path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
});

export default mergeConfig(reactConfig, projectConfig);
