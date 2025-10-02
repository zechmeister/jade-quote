import { auth } from "@/infra/auth";
import { NextRequest, NextResponse } from "next/server";
import { isAllowed } from "@/app/api/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();

  return isAllowed(request.nextUrl.pathname, session)
    ? NextResponse.next()
    : NextResponse.json(
        { error: session?.user?.id ? "Forbidden" : "Unauthorized" },
        { status: session?.user?.id ? 403 : 401 }
      );
}

export const config = {
  matcher: ["/api/:path*"],
};
