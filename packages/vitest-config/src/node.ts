import { mergeConfig } from "vitest/config";
import { baseConfig } from "./base.js";

export const nodeConfig = mergeConfig(baseConfig, {
  test: {
    environment: "node",
  },
});
