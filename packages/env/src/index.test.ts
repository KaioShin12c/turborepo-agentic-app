import { describe, expect, it } from "vitest";

describe("@repo/env", () => {
  it("should export env module", async () => {
    const envModule = await import("./index.js");
    expect(envModule).toBeDefined();
    expect(envModule).toHaveProperty("env");
  });

  it("should have expected environment variable keys", async () => {
    const { env } = await import("./index.js");
    expect(env).toBeDefined();
    expect(typeof env).toBe("object");
  });
});
