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

export const riskBands = ["A", "B", "C"] as const;
export type RiskBand = (typeof riskBands)[number];

export const termYearsOptions = [5, 10, 15] as const;
export type TermYears = (typeof termYearsOptions)[number];

export const aprByBand = { A: 0.069, B: 0.089, C: 0.119 } as const;
export type Apr = (typeof aprByBand)[keyof typeof aprByBand];

export type Quote = {
  id: string;
  systemPrice: number;
  riskBand: RiskBand;
  offers: Offer[];
};

export type Offer = {
  termYears: TermYears;
  apr: Apr;
  principalUsed: number;
  monthlyPayment: number;
};
