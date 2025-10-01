import { QuoteRequestSchema } from "@/domain/quote";
import { quoteService } from "@/app/provide";
import { withAuth } from "@/app/auth";
import { NextResponse } from "next/server";

export const POST = withAuth(async (request, session) => {
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

  const result = await quoteService.createQuote(session.user!.id, quoteRequest);

  return NextResponse.json(result);
});

export const GET = withAuth(async (_request, session) => {
  const quotes = await quoteService.getQuotesByUserId(session.user!.id);

  return NextResponse.json(quotes);
});
