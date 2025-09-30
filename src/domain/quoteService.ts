import {
  calculateAPR,
  calculateMonthlyPayment,
  calculatePrincipal,
  calculateRiskBand,
  calculateSystemPrice,
} from "./pricing";
import { Quote, QuoteRequest, termYearOptions } from "./quote";

export function getQuote(request: QuoteRequest): Quote {
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
    offers: termYearOptions.map((termYears) => ({
      termYears,
      apr,
      principalUsed: principal,
      monthlyPayment: calculateMonthlyPayment(termYears, principal, apr),
    })),
  };
}
