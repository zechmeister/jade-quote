import {
  calculateAPR,
  calculateMonthlyPayment,
  calculatePrincipal,
  calculateRiskBand,
  calculateSystemPrice,
} from "./pricing";
import { Quote, QuoteRequest, termYearsOptions } from "./quote";
import type { QuoteRepository } from "./quoteRepository";

export function calculateQuote(request: QuoteRequest): Quote {
  const principal = calculatePrincipal(
    request.systemSizeKw,
    request.downPayment
  );
  const riskBand = calculateRiskBand(
    request.monthlyConsumptionKwh,
    request.systemSizeKw
  );
  const apr = calculateAPR(riskBand);

  return {
    systemPrice: calculateSystemPrice(request.systemSizeKw),
    riskBand,
    offers: termYearsOptions.map((termYears) => ({
      termYears,
      apr,
      principalUsed: principal,
      monthlyPayment: calculateMonthlyPayment(termYears, principal, apr),
    })),
  };
}

export function createQuoteService(repository: QuoteRepository) {
  return {
    calculateQuote,

    async createQuote(
      userId: string,
      request: QuoteRequest
    ): Promise<{ id: string; quote: Quote }> {
      const quote = calculateQuote(request);
      const id = await repository.save(userId, request, quote);
      return { id, quote };
    },

    async getQuoteById(
      id: string
    ): Promise<{ request: QuoteRequest; quote: Quote } | null> {
      return repository.findById(id);
    },

    async getQuotesByUserId(
      userId: string
    ): Promise<Array<{ id: string; request: QuoteRequest; quote: Quote }>> {
      return repository.findByUserId(userId);
    },
  };
}
