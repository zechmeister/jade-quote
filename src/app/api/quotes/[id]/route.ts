import { quoteService } from "@/app/provide";
import { auth } from "@/infra/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const result = await quoteService.findByIdAndUserId(id, session.user.id);
  if (!result)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(result);
}
