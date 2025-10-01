import { withAuth } from "@/app/auth";
import { auth } from "@/infra/auth";
import { NextRequest, NextResponse } from "next/server";
import type { Session } from "next-auth";
import { describe, expect, test, vi } from "vitest";

vi.mock("@/infra/auth", () => ({
  auth: vi.fn(),
}));

describe("withAuth", () => {
  const mockAuth = vi.mocked(auth);

  test("should return 401 when no session", async () => {
    mockAuth.mockResolvedValue(null);

    const handler = withAuth(async () => {
      return NextResponse.json({ data: "success" });
    });

    const request = new NextRequest("http://localhost:3000/api/test");
    const response = await handler(request);

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body).toEqual({ error: "Unauthorized" });
  });

  test("should call handler with session when authenticated", async () => {
    const mockSession: Session = {
      user: { id: "user-123", name: "Test User", email: "test@example.com" },
      expires: "2024-01-01",
    };
    mockAuth.mockResolvedValue(mockSession);

    const mockHandler = vi
      .fn()
      .mockResolvedValue(NextResponse.json({ data: "success" }));

    const handler = withAuth(mockHandler);

    const request = new NextRequest("http://localhost:3000/api/test");
    const response = await handler(request);

    expect(response.status).toBe(200);
    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith(request, mockSession);

    const body = await response.json();
    expect(body).toEqual({ data: "success" });
  });
});
