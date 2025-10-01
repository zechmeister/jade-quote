import { auth } from "@/infra/auth";
import { NextRequest, NextResponse } from "next/server";
import type { Session } from "next-auth";

type AuthenticatedHandler = (
  request: NextRequest,
  session: Session
) => Promise<Response> | Response;

export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest): Promise<Response> => {
    const session = await auth();

    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return handler(request, session);
  };
}
