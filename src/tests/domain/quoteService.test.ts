import { type Quote, type QuoteRequest } from "@/domain/quote";
import { type QuoteRepository } from "@/domain/quoteRepository";
import { calculateQuote, createQuoteService } from "@/domain/quoteService";
import { describe, expect, test, vi } from "vitest";

describe("quoteService", () => {
  describe("calculateQuote", () => {
    test("should calculate correct Quote from request", () => {
      const request: QuoteRequest = {
        fullName: "foo name",
        email: "test@example.com",
        address: "foo address",
        monthlyConsumptionKwh: 400,
        systemSizeKw: 20,
        downPayment: 5000,
      };

      expect(calculateQuote(request)).toStrictEqual({
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
      });
    });
  });

  describe("createQuoteService", () => {
    const request: QuoteRequest = {
      fullName: "foo name",
      email: "test@example.com",
      address: "foo address",
      monthlyConsumptionKwh: 400,
      systemSizeKw: 20,
      downPayment: 5000,
    };

    const expectedQuote: Quote = {
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
      const mockSave = vi.fn().mockResolvedValue("quote-123");
      const repository: QuoteRepository = {
        save: mockSave,
        findById: vi.fn(),
        findByUserId: vi.fn(),
      };

      const service = createQuoteService(repository);
      const result = await service.createQuote("user-456", request);

      expect(result).toEqual({
        id: "quote-123",
        quote: expectedQuote,
      });

      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledWith("user-456", request, expectedQuote);
    });
  });
});
