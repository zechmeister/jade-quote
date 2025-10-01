import { auth } from "@/infra/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/auth"))
    return NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api")) {
    const session = await auth();

    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
