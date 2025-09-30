import { QuoteRequest } from "@/domain/quote";
import { getQuote } from "@/domain/quoteService";
import { describe, expect, test } from "vitest";

describe("quoteService", () => {
  test("should get correct Quote from request", () => {
    const request: QuoteRequest = {
      fullName: "foo name",
      email: "test@example.com",
      address: "foo address",
      monthlyConsumptionKwh: 400,
      systemSizeKw: 20,
      downPayment: 5000,
    };

    expect(getQuote(request)).toStrictEqual({
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
