import {
  aprByBand,
  Offer,
  Quote,
  QuoteRequest,
  termYearsOptions,
} from "./quote";

export function calculateSystemPrice(
  systemSizeKw: QuoteRequest["systemSizeKw"]
): Quote["systemPrice"] {
  return systemSizeKw * 1200;
}

export function calculatePrincipal(
  systemSizeKw: QuoteRequest["systemSizeKw"],
  downPayment: QuoteRequest["downPayment"] = 0
): Offer["principalUsed"] {
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

export function calculateAPR(riskBand: Quote["riskBand"]) {
  return aprByBand[riskBand];
}

export function calculateMonthlyPayment(
  termYears: Offer["termYears"],
  principal: number,
  apr: Offer["apr"]
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

export function calculateQuote(
  request: QuoteRequest
): Omit<Quote, "id" | "createdAt" | "user"> {
  const principal = calculatePrincipal(
    request.systemSizeKw,
    request.downPayment
  );
  const riskBand = calculateRiskBand(
    request.monthlyConsumptionKwh,
    request.systemSizeKw
  );
  const apr = calculateAPR(riskBand);

  return {
    systemPrice: calculateSystemPrice(request.systemSizeKw),
    riskBand,
    offers: termYearsOptions.map((termYears) => ({
      termYears,
      apr,
      principalUsed: principal,
      monthlyPayment: calculateMonthlyPayment(termYears, principal, apr),
    })),
  };
}
