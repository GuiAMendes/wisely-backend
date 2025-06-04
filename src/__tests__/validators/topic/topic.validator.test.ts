// Validator
import { TopicValidator } from "../../../domain/validator/topic/topic.validator";

// Constants
import { TOPIC_NAME_LENGTH } from "../../../domain/constants/topic/topic.constants";

describe("TopicValidator", () => {
  describe("ensureSafeName", () => {
    it("should throw error for unsafe name", () => {
      expect(() => TopicValidator.ensureSafeName("DROP TABLE")).toThrow(
        "O nome do tópico é inseguro ou inválido."
      );
    });

    it("should not throw error for safe name", () => {
      expect(() => TopicValidator.ensureSafeName("Tópico123")).not.toThrow();
    });
  });

  describe("ensureTopicNameHasMinimumLength", () => {
    it("should throw error for name shorter than minimum", () => {
      const shortName = "1234567";
      expect(() =>
        TopicValidator.ensureTopicNameHasMinimumLength(shortName)
      ).toThrow(
        `Nome do tópico deve conter pelo menos ${TOPIC_NAME_LENGTH.MIN} caracteres.`
      );
    });

    it("should not throw for name with exactly minimum length", () => {
      const minName = "12345678";
      expect(() =>
        TopicValidator.ensureTopicNameHasMinimumLength(minName)
      ).not.toThrow();
    });
  });

  describe("ensureTopicNameIsWithinLimit", () => {
    it("should throw error for name exceeding maximum", () => {
      const longName =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel enim elementum, fringilla leo a, maxi";
      expect(() =>
        TopicValidator.ensureTopicNameIsWithinLimit(longName)
      ).toThrow(
        `Nome do tópico não pode exceder ${TOPIC_NAME_LENGTH.MAX} caracteres.`
      );
    });

    it("should not throw for name with exactly maximum length", () => {
      const maxName = "1234567890";
      expect(() =>
        TopicValidator.ensureTopicNameIsWithinLimit(maxName)
      ).not.toThrow();
    });
  });
});
