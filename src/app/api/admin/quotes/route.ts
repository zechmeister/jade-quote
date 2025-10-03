import { quoteService } from "@/app/provide";
import { logger } from "@/infra/logger";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;

  try {
    const quotes = await quoteService.getAll(search);
    logger.info({ search, count: quotes.length }, "Admin retrieved quotes");
    return NextResponse.json(quotes);
  } catch (error) {
    logger.error({ error, search }, "Failed to retrieve quotes");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
