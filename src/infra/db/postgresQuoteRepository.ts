import { and, eq, or, ilike, exists, sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Quote, QuoteRequest } from "../../domain/quote";
import type { QuoteRepository } from "../../domain/quoteRepository";
import { offersTable, quotesTable, usersTable } from "./schema";
import type * as schema from "./schema";
import { mapToQuoteData } from "./transformers";

export function createQuoteRepository(
  db: NodePgDatabase<typeof schema>
): QuoteRepository {
  return {
    async save(request: QuoteRequest, quote: Quote): Promise<string> {
      return await db.transaction(async (tx) => {
        await tx
          .insert(usersTable)
          .values({
            id: quote.user.id,
            name: quote.user.name,
            email: quote.user.email,
          })
          .onConflictDoUpdate({
            target: usersTable.id,
            set: {
              name: quote.user.name,
              email: quote.user.email,
            },
          });

        const [insertedQuote] = await tx
          .insert(quotesTable)
          .values({
            userId: quote.user.id,
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
          user: true,
        },
      });

      if (!quoteRow) {
        return null;
      }

      return mapToQuoteData(quoteRow);
    },

    async findByIdAndUserId(
      id: string,
      userId: string
    ): Promise<{ request: QuoteRequest; quote: Quote } | null> {
      const quoteRow = await db.query.quotesTable.findFirst({
        where: and(eq(quotesTable.id, id), eq(quotesTable.userId, userId)),
        with: {
          offers: true,
          user: true,
        },
      });

      if (!quoteRow) {
        return null;
      }

      return mapToQuoteData(quoteRow);
    },

    async getAllByUserId(
      userId: string
    ): Promise<Array<{ request: QuoteRequest; quote: Quote }>> {
      const quoteRows = await db.query.quotesTable.findMany({
        where: eq(quotesTable.userId, userId),
        with: {
          offers: true,
          user: true,
        },
        orderBy: (quotes, { desc }) => [desc(quotes.createdAt)],
      });

      return quoteRows.map((row) => mapToQuoteData(row));
    },

    async findAll(searchTerm?: string) {
      const rows = await db.query.quotesTable.findMany({
        where: (quotes) =>
          searchTerm
            ? exists(
                db
                  .select({ one: sql`1` })
                  .from(usersTable)
                  .where(
                    and(
                      eq(usersTable.id, quotes.userId),
                      or(
                        ilike(usersTable.name, `%${searchTerm}%`),
                        ilike(usersTable.email, `%${searchTerm}%`)
                      )
                    )
                  )
              )
            : undefined,
        with: {
          offers: true,
          user: true,
        },
        orderBy: (quotes, { desc }) => [desc(quotes.createdAt)],
      });

      return rows.map(mapToQuoteData);
    },
  };
}
