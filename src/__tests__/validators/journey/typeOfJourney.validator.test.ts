import { TypeOfJourneyValidator } from "../../../domain/validator/journey/typeOfJourney.validator";

describe("TypeOfJourneyValidator", () => {
  describe("ensureValidType", () => {
    it("should throw error for invalid type", () => {
      expect(() => TypeOfJourneyValidator.ensureValidType("freestyle")).toThrow(
        "Tipo de jornada inválido."
      );
    });

    it("should not throw for valid types", () => {
      expect(() =>
        TypeOfJourneyValidator.ensureValidType("free")
      ).not.toThrow();
      expect(() =>
        TypeOfJourneyValidator.ensureValidType("full")
      ).not.toThrow();
    });
  });
});
