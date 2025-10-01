import { QuoteRequestSchema } from "@/domain/quote";
import { quoteService } from "@/app/provide";
import { auth } from "@/infra/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    console.log("no session found", session);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const result = await quoteService.createQuote(session.user.id, quoteRequest);

  return NextResponse.json(result);
}
