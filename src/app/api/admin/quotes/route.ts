import { quoteService } from "@/app/provide";
import { auth } from "@/infra/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // TODO: Check for admin or rely on middleware
  // if (!session.user.roles?.includes('admin'))
  //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;

  const quotes = await quoteService.getAll(search);

  return NextResponse.json(quotes);
}
