import { QuoteRequestSchema } from "@/domain/quote";
import { getQuote } from "@/domain/quoteService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const parseResult = QuoteRequestSchema.safeParse(body);
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

  const quoteRequest = parseResult.data;

  return NextResponse.json(getQuote(quoteRequest));
}
