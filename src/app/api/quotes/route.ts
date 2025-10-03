import { QuoteRequestSchema } from "@/domain/quote";
import { quoteService } from "@/app/provide";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/infra/auth";
import { logger } from "@/infra/logger";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parseResult = QuoteRequestSchema.safeParse(await request.json());
  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parseResult.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  const user = {
    id: session.user.id,
    name: session.user.name || "",
    email: session.user.email || "",
  };

  try {
    const quoteId = await quoteService.create(parseResult.data, user);
    logger.info({ quoteId: quoteId, userId: session.user.id }, "Quote created");
    return NextResponse.json(quoteId);
  } catch (error) {
    logger.error({ error, userId: session.user.id }, "Failed to create quote");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const quotes = await quoteService.getAllByUserId(session.user.id);
  return NextResponse.json(quotes);
}
