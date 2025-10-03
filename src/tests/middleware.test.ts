import { isAllowed } from "@/app/api/auth";
import { test, expect, describe } from "vitest";

describe("isAllowed", () => {
  describe("/api/auth paths", () => {
    test("should allow unauthenticated access", () => {
      expect(isAllowed("/api/auth/signin", null)).toBe(true);
    });
  });

  describe("/api/health paths", () => {
    test("should allow unauthenticated access", () => {
      expect(isAllowed("/api/health", null)).toBe(true);
    });
  });

  describe("/api paths", () => {
    test("should deny when not authenticated", () => {
      expect(isAllowed("/api/quotes", null)).toBe(false);
    });

    test("should allow authenticated user", () => {
      const session = {
        user: {
          id: "user-123",
          roles: [],
          name: "Test",
          email: "test@test.com",
        },
        expires: "2025-01-01",
      };
      expect(isAllowed("/api/quotes", session)).toBe(true);
    });
  });

  describe("/api/admin paths", () => {
    test("should deny when not authenticated", () => {
      expect(isAllowed("/api/admin/quotes", null)).toBe(false);
    });

    test("should deny when authenticated but not admin", () => {
      const session = {
        user: {
          id: "user-123",
          roles: ["user"],
          name: "Test",
          email: "test@test.com",
        },
        expires: "2025-01-01",
      };
      expect(isAllowed("/api/admin/quotes", session)).toBe(false);
    });

    test("should allow admin user", () => {
      const session = {
        user: {
          id: "admin-123",
          roles: ["admin"],
          name: "Admin",
          email: "admin@test.com",
        },
        expires: "2025-01-01",
      };
      expect(isAllowed("/api/admin/quotes", session)).toBe(true);
    });
  });

  describe("non-api paths", () => {
    test("should allow all traffic", () => {
      expect(isAllowed("/quotes", null)).toBe(true);
      expect(isAllowed("/", null)).toBe(true);
    });
  });
});
