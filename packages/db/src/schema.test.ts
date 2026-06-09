import { describe, expect, it } from "vitest";
import * as schema from "./schema.js";

describe("@repo/db schema", () => {
  it("should export user table", () => {
    expect(schema.user).toBeDefined();
    // Drizzle pgTable exposes columns as enumerable own properties
    expect(schema.user).toHaveProperty("id");
    expect(schema.user).toHaveProperty("name");
    expect(schema.user).toHaveProperty("email");
    expect(schema.user).toHaveProperty("emailVerified");
    expect(schema.user).toHaveProperty("image");
    expect(schema.user).toHaveProperty("createdAt");
    expect(schema.user).toHaveProperty("updatedAt");
  });

  it("should export session table", () => {
    expect(schema.session).toBeDefined();
    expect(schema.session).toHaveProperty("id");
    expect(schema.session).toHaveProperty("expiresAt");
    expect(schema.session).toHaveProperty("token");
    expect(schema.session).toHaveProperty("ipAddress");
    expect(schema.session).toHaveProperty("userAgent");
    expect(schema.session).toHaveProperty("userId");
  });

  it("should export account table", () => {
    expect(schema.account).toBeDefined();
    expect(schema.account).toHaveProperty("id");
    expect(schema.account).toHaveProperty("accountId");
    expect(schema.account).toHaveProperty("providerId");
    expect(schema.account).toHaveProperty("userId");
  });

  it("should export verification table", () => {
    expect(schema.verification).toBeDefined();
    expect(schema.verification).toHaveProperty("id");
    expect(schema.verification).toHaveProperty("identifier");
    expect(schema.verification).toHaveProperty("value");
    expect(schema.verification).toHaveProperty("expiresAt");
  });
});
