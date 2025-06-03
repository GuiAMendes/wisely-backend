// Validator
import { FlashcardValidator } from "../../../domain/validator/flashcard/flashcard.validator";

// Constants
import {
  QUESTION_INTERVAL_LENGTH,
  RESPONSE_INTERVAL_LENGTH,
} from "../../../domain/constants/flashcard/flashcard.constants";

describe("FlashcardValidator", () => {
  describe("ensureValidQuestion", () => {
    it("should throw error for unsafe question", () => {
      expect(() =>
        FlashcardValidator.ensureValidQuestion("DROP DATABASE")
      ).toThrow("A pergunta contém conteúdo inseguro ou inválido.");
    });

    it("should throw error for question shorter than minimum", () => {
      expect(() => FlashcardValidator.ensureValidQuestion("1234567")).toThrow(
        `A pergunta deve ter no mínimo ${QUESTION_INTERVAL_LENGTH.MIN} caracteres.`
      );
    });

    it("should throw error for question longer than maximum", () => {
      const longQuestion = "a".repeat(QUESTION_INTERVAL_LENGTH.MAX + 1);
      expect(() =>
        FlashcardValidator.ensureValidQuestion(longQuestion)
      ).toThrow(
        `A pergunta não pode exceder ${QUESTION_INTERVAL_LENGTH.MAX} caracteres.`
      );
    });

    it("should not throw error for valid question", () => {
      const validQuestion = "O que é JavaScript?";
      expect(() =>
        FlashcardValidator.ensureValidQuestion(validQuestion)
      ).not.toThrow();
    });
  });

  describe("ensureValidResponse", () => {
    it("should throw error for unsafe response", () => {
      expect(() =>
        FlashcardValidator.ensureValidResponse("DROP DATABASE")
      ).toThrow("A resposta contém conteúdo inseguro ou inválido.");
    });

    it("should throw error for response shorter than minimum", () => {
      const shortResponse = "1234567";
      expect(() =>
        FlashcardValidator.ensureValidResponse(shortResponse)
      ).toThrow(
        `A resposta deve ter no mínimo ${RESPONSE_INTERVAL_LENGTH.MIN} caracteres.`
      );
    });

    it("should throw error for response longer than maximum", () => {
      const longResponse = "a".repeat(RESPONSE_INTERVAL_LENGTH.MAX + 1);
      expect(() =>
        FlashcardValidator.ensureValidResponse(longResponse)
      ).toThrow(
        `A resposta não pode exceder ${RESPONSE_INTERVAL_LENGTH.MAX} caracteres.`
      );
    });

    it("should not throw error for valid response", () => {
      const validResponse =
        "JavaScript é uma linguagem de programação usada principalmente no desenvolvimento web.";
      expect(() =>
        FlashcardValidator.ensureValidResponse(validResponse)
      ).not.toThrow();
    });
  });
});
