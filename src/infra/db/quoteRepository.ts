import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Quote, QuoteRequest } from "../../domain/quote";
import type { QuoteRepository } from "../../domain/quoteRepository";
import { offersTable, quotesTable } from "./schema";
import type * as schema from "./schema";
import { mapToQuoteData } from "./transformers";

export function createQuoteRepository(
  db: NodePgDatabase<typeof schema>
): QuoteRepository {
  return {
    async save(
      userId: string,
      request: QuoteRequest,
      quote: Quote
    ): Promise<string> {
      return await db.transaction(async (tx) => {
        const [insertedQuote] = await tx
          .insert(quotesTable)
          .values({
            userId,
            fullName: request.fullName,
            email: request.email,
            address: request.address,
            monthlyConsumptionKwh: request.monthlyConsumptionKwh.toString(),
            systemSizeKw: request.systemSizeKw.toString(),
            downPayment: request.downPayment?.toString(),
            systemPrice: quote.systemPrice.toString(),
            riskBand: quote.riskBand,
          })
          .returning({ id: quotesTable.id });

        await tx.insert(offersTable).values(
          quote.offers.map((offer) => ({
            quoteId: insertedQuote.id,
            termYears: offer.termYears,
            apr: offer.apr.toString(),
            principalUsed: offer.principalUsed.toString(),
            monthlyPayment: offer.monthlyPayment.toString(),
          }))
        );

        return insertedQuote.id;
      });
    },

    async findById(
      id: string
    ): Promise<{ request: QuoteRequest; quote: Quote } | null> {
      const quoteRow = await db.query.quotesTable.findFirst({
        where: eq(quotesTable.id, id),
        with: {
          offers: true,
        },
      });

      if (!quoteRow) {
        return null;
      }

      return mapToQuoteData(quoteRow);
    },

    async findByUserId(
      userId: string
    ): Promise<Array<{ id: string; request: QuoteRequest; quote: Quote }>> {
      const quoteRows = await db.query.quotesTable.findMany({
        where: eq(quotesTable.userId, userId),
        with: {
          offers: true,
        },
        orderBy: (quotes, { desc }) => [desc(quotes.createdAt)],
      });

      return quoteRows.map((row) => ({
        id: row.id,
        ...mapToQuoteData(row),
      }));
    },
  };
}
