export type QuoteRequest = {
  fullName: string;
  email: string;
  address: string;
  monthlyConsumptionKwh: number;
  systemSizeKw: number;
  downPayment?: number;
};

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
