import {
  Apr,
  aprByBand,
  type Quote,
  type QuoteRequest,
  TermYears,
  termYearsOptions,
} from "../../domain/quote";
import type { User } from "@/domain/user";
import { offersTable, quotesTable, usersTable } from "./schema";

export type QuoteWithOffers = typeof quotesTable.$inferSelect & {
  offers: Array<typeof offersTable.$inferSelect>;
  user: typeof usersTable.$inferSelect;
};

export function toDomainOffer(
  dbOffer: typeof offersTable.$inferSelect
): Quote["offers"][number] {
  const termYears = dbOffer.termYears;
  const apr = parseFloat(dbOffer.apr);

  isTermYears(termYears);
  isApr(apr);

  return {
    termYears,
    apr,
    principalUsed: parseFloat(dbOffer.principalUsed),
    monthlyPayment: parseFloat(dbOffer.monthlyPayment),
  };
}

export function toDomainUser(dbUser: typeof usersTable.$inferSelect): User {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
  };
}

export function toDomainQuote(quoteRow: QuoteWithOffers): Quote {
  return {
    id: quoteRow.id,
    systemPrice: parseFloat(quoteRow.systemPrice),
    riskBand: quoteRow.riskBand,
    offers: quoteRow.offers.map(toDomainOffer),
    createdAt: quoteRow.createdAt,
    user: toDomainUser(quoteRow.user),
  };
}

export function toDomainQuoteRequest(quoteRow: QuoteWithOffers): QuoteRequest {
  return {
    address: quoteRow.address,
    monthlyConsumptionKwh: parseFloat(quoteRow.monthlyConsumptionKwh),
    systemSizeKw: parseFloat(quoteRow.systemSizeKw),
    downPayment: quoteRow.downPayment
      ? parseFloat(quoteRow.downPayment)
      : undefined,
  };
}

export function mapToQuoteData(quoteRow: QuoteWithOffers): {
  request: QuoteRequest;
  quote: Quote;
} {
  return {
    request: toDomainQuoteRequest(quoteRow),
    quote: toDomainQuote(quoteRow),
  };
}

function isTermYears(value: number): asserts value is TermYears {
  if (termYearsOptions.includes(value as TermYears)) return;
  throw new Error(`Invalid termYears from DB: ${value}`);
}

function isApr(value: number): asserts value is Apr {
  if (Object.values(aprByBand).includes(value as Apr)) return;
  throw new Error(`Invalid apr from DB: ${value}`);
}
