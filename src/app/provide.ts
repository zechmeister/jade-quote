import { db } from "@/infra/db/config";
import { createQuoteRepository } from "@/infra/db/quoteRepository";
import { createQuoteService } from "@/domain/quoteService";

const quoteRepository = createQuoteRepository(db);

export const quoteService = createQuoteService(quoteRepository);
