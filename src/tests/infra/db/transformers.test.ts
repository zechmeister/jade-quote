import { describe, expect, test } from "vitest";
import {
  type QuoteWithOffers,
  toDomainOffer,
  toDomainQuote,
  toDomainQuoteRequest,
} from "@/infra/db/transformers";

describe("transformers", () => {
  describe("toDomainOffer", () => {
    test("should convert valid DB offer to domain Offer", () => {
      const dbOffer = {
        id: "offer-1",
        quoteId: "quote-1",
        termYears: 10,
        apr: "0.089",
        principalUsed: "19000",
        monthlyPayment: "239.66",
      };

      const result = toDomainOffer(dbOffer);

      expect(result).toEqual({
        termYears: 10,
        apr: 0.089,
        principalUsed: 19000,
        monthlyPayment: 239.66,
      });
    });

    test("should throw error for invalid termYears", () => {
      const dbOffer = {
        id: "offer-1",
        quoteId: "quote-1",
        termYears: 7,
        apr: "0.089",
        principalUsed: "19000",
        monthlyPayment: "239.66",
      };

      expect(() => toDomainOffer(dbOffer)).toThrow(
        "Invalid termYears from DB: 7"
      );
    });

    test("should throw error for invalid apr", () => {
      const dbOffer = {
        id: "offer-1",
        quoteId: "quote-1",
        termYears: 10,
        apr: "0.05",
        principalUsed: "19000",
        monthlyPayment: "239.66",
      };

      expect(() => toDomainOffer(dbOffer)).toThrow("Invalid apr from DB: 0.05");
    });
  });

  describe("toDomainQuote", () => {
    test("should convert valid DB quote to domain Quote", () => {
      const dbQuote: QuoteWithOffers = {
        id: "quote-1",
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        fullName: "John Doe",
        email: "john@example.com",
        address: "123 Main St",
        monthlyConsumptionKwh: "400",
        systemSizeKw: "20",
        downPayment: "5000",
        systemPrice: "24000",
        riskBand: "B",
        offers: [
          {
            id: "offer-1",
            quoteId: "quote-1",
            termYears: 10,
            apr: "0.089",
            principalUsed: "19000",
            monthlyPayment: "239.66",
          },
        ],
      };

      const result = toDomainQuote(dbQuote);

      expect(result).toEqual({
        systemPrice: 24000,
        riskBand: "B",
        offers: [
          {
            termYears: 10,
            apr: 0.089,
            principalUsed: 19000,
            monthlyPayment: 239.66,
          },
        ],
      });
    });

    test("should convert multiple offers", () => {
      const dbQuote: QuoteWithOffers = {
        id: "quote-1",
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        fullName: "John Doe",
        email: "john@example.com",
        address: "123 Main St",
        monthlyConsumptionKwh: "400",
        systemSizeKw: "20",
        downPayment: "5000",
        systemPrice: "24000",
        riskBand: "B",
        offers: [
          {
            id: "offer-1",
            quoteId: "quote-1",
            termYears: 5,
            apr: "0.089",
            principalUsed: "19000",
            monthlyPayment: "393.49",
          },
          {
            id: "offer-2",
            quoteId: "quote-1",
            termYears: 10,
            apr: "0.089",
            principalUsed: "19000",
            monthlyPayment: "239.66",
          },
          {
            id: "offer-3",
            quoteId: "quote-1",
            termYears: 15,
            apr: "0.089",
            principalUsed: "19000",
            monthlyPayment: "191.58",
          },
        ],
      };

      const result = toDomainQuote(dbQuote);

      expect(result.offers).toHaveLength(3);
      expect(result.offers[0].termYears).toBe(5);
      expect(result.offers[1].termYears).toBe(10);
      expect(result.offers[2].termYears).toBe(15);
    });
  });

  describe("toDomainQuoteRequest", () => {
    test("should convert DB row to QuoteRequest", () => {
      const dbQuote: QuoteWithOffers = {
        id: "quote-1",
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        fullName: "John Doe",
        email: "john@example.com",
        address: "123 Main St",
        monthlyConsumptionKwh: "400",
        systemSizeKw: "20",
        downPayment: "5000",
        systemPrice: "24000",
        riskBand: "B",
        offers: [],
      };

      const result = toDomainQuoteRequest(dbQuote);

      expect(result).toEqual({
        fullName: "John Doe",
        email: "john@example.com",
        address: "123 Main St",
        monthlyConsumptionKwh: 400,
        systemSizeKw: 20,
        downPayment: 5000,
      });
    });

    test("should parse numeric strings correctly", () => {
      const dbQuote: QuoteWithOffers = {
        id: "quote-1",
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        fullName: "John Doe",
        email: "john@example.com",
        address: "123 Main St",
        monthlyConsumptionKwh: "450.5",
        systemSizeKw: "25.75",
        downPayment: "5500.25",
        systemPrice: "24000",
        riskBand: "B",
        offers: [],
      };

      const result = toDomainQuoteRequest(dbQuote);

      expect(result.monthlyConsumptionKwh).toBe(450.5);
      expect(result.systemSizeKw).toBe(25.75);
      expect(result.downPayment).toBe(5500.25);
    });
  });
});
