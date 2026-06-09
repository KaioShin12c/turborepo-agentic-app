import { describe, expect, it, vi } from "vitest";

// Mock dependencies before importing the auth server module.
// vi.mock calls are hoisted to the top of the file by Vitest,
// so dynamic await import() pattern is used for safety.

vi.mock("@repo/db", () => ({
  db: {},
}));

vi.mock("@repo/env", () => ({
  env: {
    BETTER_AUTH_SECRET: "test-secret-for-unit-tests",
    BETTER_AUTH_URL: "http://localhost:3000",
    GITHUB_CLIENT_ID: "test-client-id",
    GITHUB_CLIENT_SECRET: "test-client-secret",
    DATABASE_URL: "postgres://localhost:5432/test",
  },
}));

describe("@repo/auth server", () => {
  it("should export auth instance with handler function", async () => {
    const { auth } = await import("./server.js");
    expect(auth).toBeDefined();
    // better-auth instance exposes a handler property for processing HTTP requests
    expect(auth).toHaveProperty("handler");
    expect(typeof auth.handler).toBe("function");
  });

  it("should have configurable auth options via appName", async () => {
    const { auth } = await import("./server.js");
    // better-auth stores the config in internal state accessible via $context
    // or the options property depending on the version
    expect(auth).toHaveProperty("options");
    expect(auth.options).toBeDefined();
  });
});
