import { test, expect, describe } from "vitest";
import {
  calculateMonthlyPayment,
  calculatePrincipal,
  calculateRiskBand,
} from "@/domain/pricing";

describe("calculatePrincipal", () => {
  test("should calculate principal for reasonable numbers", () => {
    expect(calculatePrincipal(5, 1000)).toBe(5000);
  });

  test("should clamp at zero", () => {
    expect(calculatePrincipal(5, 10000)).toBe(0);
  });

  test("should return 0 for non-positive or zero system size", () => {
    expect(calculatePrincipal(0, 1000)).toBe(0);
    expect(calculatePrincipal(-2, 500)).toBe(0);
    expect(calculatePrincipal(0, 0)).toBe(0);
  });
});

describe("calculateRiskBand", () => {
  test("should return A at the exact boundary: consumption 400 and size 6", () => {
    expect(calculateRiskBand(400, 6)).toBe("A");
  });
  test("should return A for high consumption ≥400 with size ≤6", () => {
    expect(calculateRiskBand(10000, 6)).toBe("A");
    expect(calculateRiskBand(400, 2)).toBe("A");
  });

  test("should return B at the lower boundary: consumption 250", () => {
    expect(calculateRiskBand(250, 10)).toBe("B");
  });
  test("should return B when consumption ≥250 but size >6", () => {
    expect(calculateRiskBand(1000, 7)).toBe("B");
    expect(calculateRiskBand(400, 7)).toBe("B");
    expect(calculateRiskBand(4000, 100)).toBe("B");
  });

  test("should return C just below the cutoff: consumption 249", () => {
    expect(calculateRiskBand(249, 10)).toBe("C");
  });
  test("should return C when consumption <250 regardless of size", () => {
    expect(calculateRiskBand(200, 4)).toBe("C");
    expect(calculateRiskBand(100, 70)).toBe("C");
  });
});

describe("calculateMonthlyPayment", () => {
  test("should calculate correct monthlyPayment", () => {
    expect(calculateMonthlyPayment(5, 14000, 0.069)).toBe(276.56);
    expect(calculateMonthlyPayment(10, 14000, 0.069)).toBe(161.83);
    expect(calculateMonthlyPayment(15, 14000, 0.069)).toBe(125.05);
  });

  test("should return 0 when principal is 0", () => {
    expect(calculateMonthlyPayment(10, 0, 0.089)).toBe(0);
  });
});
