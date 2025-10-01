import { Quote, QuoteRequest } from "./quote";

export type QuoteRepository = {
  save(
    userId: string,
    request: QuoteRequest,
    quote: Omit<Quote, "id">
  ): Promise<string>;
  findById(id: string): Promise<{ request: QuoteRequest; quote: Quote } | null>;
  findByUserId(
    userId: string
  ): Promise<Array<{ id: string; request: QuoteRequest; quote: Quote }>>;
};
