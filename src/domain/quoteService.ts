import { calculateQuote } from "./pricing";
import { Quote, QuoteRequest } from "./quote";
import type { QuoteRepository } from "./quoteRepository";
import type { User } from "./user";

export function createQuoteService(repository: QuoteRepository) {
  return {
    async create(request: QuoteRequest, user: User): Promise<Quote> {
      const calculatedQuote = calculateQuote(request);
      const quote = { ...calculatedQuote, user };
      const id = await repository.save(request, quote);
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
    ): Promise<{ request: QuoteRequest; quote: Quote }[]> {
      return repository.getAllByUserId(userId);
    },

    async getAll(
      searchTerm?: string
    ): Promise<{ request: QuoteRequest; quote: Quote }[]> {
      return repository.findAll(searchTerm);
    },
  };
}
