// Validator
import { NoteValidator } from "../../../domain/validator/summary/note.validator";

describe("NoteValidator", () => {
  describe("ensureSafeContent", () => {
    it("should throw error for unsafe content", () => {
      expect(() => NoteValidator.ensureSafeContent("DROP TABLE")).toThrow(
        "Conteúdo inseguro ou inválido."
      );
    });

    it("should not throw error for safe content", () => {
      expect(() =>
        NoteValidator.ensureSafeContent("Conteúdo normal")
      ).not.toThrow();
    });
  });

  describe("ensureNotEmpty", () => {
    it("should throw error for empty content", () => {
      expect(() => NoteValidator.ensureNotEmpty("")).toThrow(
        "A nota não pode estar vazia."
      );
    });

    it("should throw error for content with only spaces", () => {
      expect(() => NoteValidator.ensureNotEmpty("   ")).toThrow(
        "A nota não pode estar vazia."
      );
    });

    it("should not throw error for non-empty content", () => {
      expect(() => NoteValidator.ensureNotEmpty("Alguma nota")).not.toThrow();
    });
  });
});
