import { mergeConfig } from "vitest/config";
import { baseConfig } from "./base.ts";

export const nodeConfig = mergeConfig(baseConfig, {
  test: {
    environment: "node",
  },
});
