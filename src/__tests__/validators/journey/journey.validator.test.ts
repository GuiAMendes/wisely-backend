// Validator
import { JourneyValidator } from "../../../domain/validator/journey/journey.validator";

// Constants
import { NAME_LENGTH } from "../../../domain/constants/journey/journey.constants";

describe("JourneyValidator", () => {
  describe("ensureSafeName", () => {
    it("should throw error for unsafe name", () => {
      expect(() => JourneyValidator.ensureSafeName("DROP TABLE")).toThrow(
        "O nome da jornada é insuro ou inválido."
      );
    });

    it("should not throw error for safe name", () => {
      expect(() =>
        JourneyValidator.ensureSafeName("Minha Jornada Segura")
      ).not.toThrow();
    });
  });

  describe("ensureJourneyNameHasMinimumLength", () => {
    it("should throw error for name shorter than minimum", () => {
      const shortName = "abc";
      expect(() =>
        JourneyValidator.ensureJourneyNameHasMinimumLength(shortName)
      ).toThrow(`Nome deve conter pelo menos ${NAME_LENGTH.MIN} caracteres.`);
    });

    it("should not throw for name with minimum length", () => {
      const minLengthName = "a".repeat(NAME_LENGTH.MIN);
      expect(() =>
        JourneyValidator.ensureJourneyNameHasMinimumLength(minLengthName)
      ).not.toThrow();
    });
  });

  describe("ensureJourneyNameIsWithinLimit", () => {
    it("should throw error for name exceeding max length", () => {
      const longName = "a".repeat(NAME_LENGTH.MAX + 1);
      expect(() =>
        JourneyValidator.ensureJourneyNameIsWithinLimit(longName)
      ).toThrow(`Nome não pode exceder ${NAME_LENGTH.MAX} caracteres.`);
    });

    it("should not throw for name within limit", () => {
      const validName = "a".repeat(NAME_LENGTH.MAX);
      expect(() =>
        JourneyValidator.ensureJourneyNameIsWithinLimit(validName)
      ).not.toThrow();
    });
  });
});
