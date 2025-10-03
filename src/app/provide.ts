import { db } from "@/infra/db/config";
import { createQuoteRepository } from "@/infra/db/postgresQuoteRepository";
import { createQuoteService } from "@/domain/quoteService";

const quoteRepository = createQuoteRepository(db);

export const quoteService = createQuoteService(quoteRepository);
