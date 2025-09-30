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

export type Offer = {
  termYears: 5 | 10 | 15;
  monthlyPayment: number;
};
