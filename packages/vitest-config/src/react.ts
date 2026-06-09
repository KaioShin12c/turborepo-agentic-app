import react from "@vitejs/plugin-react";
import { mergeConfig } from "vitest/config";
import { baseConfig } from "./base.ts";

export const reactConfig = mergeConfig(baseConfig, {
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/vitest.setup.ts"],
  },
});
