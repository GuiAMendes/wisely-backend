// Validator
import { SummaryValidator } from "../../../domain/validator/summary/summary.validator";

describe("SummaryValidator", () => {
  describe("ensureSafeTitle", () => {
    it("should throw error for unsafe title", () => {
      expect(() =>
        SummaryValidator.ensureSafeTitle("SELECT * FROM users")
      ).toThrow("Título inválido ou inseguro.");
    });

    it("should not throw error for safe title", () => {
      expect(() =>
        SummaryValidator.ensureSafeTitle("Resumo válido")
      ).not.toThrow();
    });
  });

  describe("ensureMinimalTitle", () => {
    it("should throw error for title shorter than minimum", () => {
      expect(() => SummaryValidator.ensureMinimalTitle("1234567")).toThrow(
        "Título muito curto."
      );
    });

    it("should not throw error for title with minimum length", () => {
      expect(() =>
        SummaryValidator.ensureMinimalTitle("12345678")
      ).not.toThrow();
    });
  });

  describe("ensureTitleWithinLimit", () => {
    it("should throw error for title longer than maximum", () => {
      expect(() =>
        SummaryValidator.ensureTitleWithinLimit("12345678901")
      ).toThrow("Título muito longo.");
    });

    it("should not throw error for title with maximum length", () => {
      expect(() =>
        SummaryValidator.ensureTitleWithinLimit("1234567890")
      ).not.toThrow();
    });
  });
});
