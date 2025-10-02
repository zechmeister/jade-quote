import { quoteService } from "@/app/provide";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;

  const quotes = await quoteService.getAll(search);

  return NextResponse.json(quotes);
}
