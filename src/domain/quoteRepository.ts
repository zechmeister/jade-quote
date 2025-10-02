import { Quote, QuoteRequest } from "./quote";

export type QuoteRepository = {
  save(
    userId: string,
    request: QuoteRequest,
    quote: Omit<Quote, "id">
  ): Promise<string>;

  findById(id: string): Promise<{ request: QuoteRequest; quote: Quote } | null>;

  findByIdAndUserId(
    id: string,
    userId: string
  ): Promise<{ request: QuoteRequest; quote: Quote } | null>;

  getAllByUserId(
    userId: string
  ): Promise<{ request: QuoteRequest; quote: Quote }[]>;

  findAll(
    searchTerm?: string
  ): Promise<{ request: QuoteRequest; quote: Quote }[]>;
};
