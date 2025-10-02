import { type Quote, type QuoteRequest } from "@/domain/quote";
import { type QuoteRepository } from "@/domain/quoteRepository";
import { createQuoteService } from "@/domain/quoteService";
import { describe, expect, test, vi } from "vitest";

describe("quoteService", () => {
  const request: QuoteRequest = {
    fullName: "foo name",
    email: "test@example.com",
    address: "foo address",
    monthlyConsumptionKwh: 400,
    systemSizeKw: 20,
    downPayment: 5000,
  };

  const expectedQuote: Quote = {
    id: "quote-1",
    systemPrice: 24000,
    riskBand: "B",
    offers: [
      {
        apr: 0.089,
        monthlyPayment: 393.49,
        principalUsed: 19000,
        termYears: 5,
      },
      {
        apr: 0.089,
        monthlyPayment: 239.66,
        principalUsed: 19000,
        termYears: 10,
      },
      {
        apr: 0.089,
        monthlyPayment: 191.58,
        principalUsed: 19000,
        termYears: 15,
      },
    ],
  };

  test("createQuote should calculate quote and save via repository", async () => {
    const mockSave = vi.fn().mockResolvedValue("quote-1");
    const repository: QuoteRepository = {
      save: mockSave,
      findById: vi.fn(),
      getAllByUserId: vi.fn(),
    };

    const service = createQuoteService(repository);
    const result = await service.create("user-456", request);

    expect(result).toEqual(expectedQuote);

    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledWith(
      "user-456",
      request,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (({ id, ...quote }) => quote)(expectedQuote)
    );
  });

  test("getQuoteById should call repository.findById", async () => {
    const mockData = { request, quote: expectedQuote };
    const mockFindById = vi.fn().mockResolvedValue(mockData);
    const repository: QuoteRepository = {
      save: vi.fn(),
      findById: mockFindById,
      getAllByUserId: vi.fn(),
    };

    const service = createQuoteService(repository);
    const result = await service.findById("quote-123");

    expect(result).toEqual(mockData);
    expect(mockFindById).toHaveBeenCalledTimes(1);
    expect(mockFindById).toHaveBeenCalledWith("quote-123");
  });

  test("getQuoteById should return null when quote not found", async () => {
    const mockFindById = vi.fn().mockResolvedValue(null);
    const repository: QuoteRepository = {
      save: vi.fn(),
      findById: mockFindById,
      getAllByUserId: vi.fn(),
    };

    const service = createQuoteService(repository);
    const result = await service.findById("nonexistent");

    expect(result).toBeNull();
    expect(mockFindById).toHaveBeenCalledWith("nonexistent");
  });

  test("getQuotesByUserId should call repository.findByUserId", async () => {
    const mockData = [
      { id: "quote-1", request, quote: expectedQuote },
      { id: "quote-2", request, quote: expectedQuote },
    ];
    const mockFindByUserId = vi.fn().mockResolvedValue(mockData);
    const repository: QuoteRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      getAllByUserId: mockFindByUserId,
    };

    const service = createQuoteService(repository);
    const result = await service.getAllByUserId("user-456");

    expect(result).toEqual(mockData);
    expect(mockFindByUserId).toHaveBeenCalledTimes(1);
    expect(mockFindByUserId).toHaveBeenCalledWith("user-456");
  });
});
