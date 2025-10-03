import { quoteService } from "@/app/provide";
import { auth } from "@/infra/auth";
import { logger } from "@/infra/logger";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const result = session.user.roles.includes("admin")
      ? await quoteService.findById(id)
      : await quoteService.findByIdAndUserId(id, session.user.id);

    if (!result) {
      logger.warn({ quoteId: id, userId: session.user.id }, "Quote not found");
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    logger.info({ quoteId: id, userId: session.user.id }, "Quote retrieved");
    return NextResponse.json(result);
  } catch (error) {
    logger.error(
      { error, quoteId: id, userId: session.user.id },
      "Failed to retrieve quote"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
