import { Offer, Quote, QuoteRequest } from "./quote";

export function calculatePrincipal(
  systemSizeKw: QuoteRequest["systemSizeKw"],
  downPayment: QuoteRequest["downPayment"] = 0
) {
  return Math.max(calculateSystemPrice(systemSizeKw) - downPayment, 0);
}

export function calculateRiskBand(
  monthlyConsumptionKwh: QuoteRequest["monthlyConsumptionKwh"],
  systemSizeKw: QuoteRequest["systemSizeKw"]
): Quote["riskBand"] {
  if (monthlyConsumptionKwh >= 400 && systemSizeKw <= 6) return "A";
  if (monthlyConsumptionKwh >= 250) return "B";
  return "C";
}

const aprByBand = { A: 0.069, B: 0.089, C: 0.119 } as const;
export function calculateAPR(riskBand: Quote["riskBand"]): number {
  return aprByBand[riskBand];
}

export function calculateMonthlyPayment(
  termYears: Offer["termYears"],
  principal: number,
  apr: (typeof aprByBand)[keyof typeof aprByBand]
): Offer["monthlyPayment"] {
  const totalMonths = termYears * 12;
  const monthlyRate = apr / 12;

  const rawMonthlyPayment =
    monthlyRate === 0
      ? principal / totalMonths
      : (principal * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -totalMonths));

  return Math.round(rawMonthlyPayment * 100) / 100;
}

function calculateSystemPrice(
  systemSizeKw: QuoteRequest["systemSizeKw"]
): Quote["systemPrice"] {
  return systemSizeKw * 1200;
}
