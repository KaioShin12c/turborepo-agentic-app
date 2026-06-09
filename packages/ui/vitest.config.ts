import path from "node:path";
import { fileURLToPath } from "node:url";
import { reactConfig } from "@repo/vitest-config/react";
import { defineConfig, mergeConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Project-specific overrides on top of the shared react preset.
 * Adds resolve.alias for the "src/*" path mapping used in tsconfig.json
 * so that vitest can resolve imports like `import { cn } from "src/lib/utils"`.
 */
const projectConfig = defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
  },
});

export default mergeConfig(reactConfig, projectConfig);
