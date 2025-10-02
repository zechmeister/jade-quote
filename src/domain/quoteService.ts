import { calculateQuote } from "./pricing";
import { Quote, QuoteRequest } from "./quote";
import type { QuoteRepository } from "./quoteRepository";

export function createQuoteService(repository: QuoteRepository) {
  return {
    async create(userId: string, request: QuoteRequest): Promise<Quote> {
      const quote = calculateQuote(request);
      const id = await repository.save(userId, request, quote);
      return { id, ...quote };
    },

    async findById(
      id: string
    ): Promise<{ request: QuoteRequest; quote: Quote } | null> {
      return repository.findById(id);
    },

    async findByIdAndUserId(
      id: string,
      userId: string
    ): Promise<{ request: QuoteRequest; quote: Quote } | null> {
      return repository.findByIdAndUserId(id, userId);
    },

    async getAllByUserId(
      userId: string
    ): Promise<{ id: string; request: QuoteRequest; quote: Quote }[]> {
      return repository.getAllByUserId(userId);
    },
  };
}
