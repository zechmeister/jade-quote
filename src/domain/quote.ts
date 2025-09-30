import { z } from "zod";

export const QuoteRequestSchema = z.object({
  fullName: z.string().min(2),
  email: z.email(),
  address: z.string().min(1),
  monthlyConsumptionKwh: z.number().positive(),
  systemSizeKw: z.number().positive(),
  downPayment: z.number().nonnegative().optional(),
});

export type QuoteRequest = z.infer<typeof QuoteRequestSchema>;

export type Quote = {
  systemPrice: number;
  riskBand: "A" | "B" | "C";
  offers: Offer[];
};

export const termYearOptions = [5, 10, 15] as const;
export const aprByBand = { A: 0.069, B: 0.089, C: 0.119 } as const;

export type Offer = {
  termYears: (typeof termYearOptions)[number];
  apr: (typeof aprByBand)[keyof typeof aprByBand];
  principalUsed: number;
  monthlyPayment: number;
};
