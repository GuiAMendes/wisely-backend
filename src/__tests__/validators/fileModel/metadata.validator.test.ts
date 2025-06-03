// Validator
import { MetaDataValidator } from "../../../domain/validator/fileModel/MetaData.validator";

// Constants
import { MAX_BASE64_SIZE } from "../../../domain/constants/fileModel/fileModel.constants";

describe("MetaDataValidator", () => {
  describe("ensureBase64Valid", () => {
    it("should throw error if content is not safe", () => {
      const unsafeContent = "<script>alert('hack')</script>";
      expect(() => MetaDataValidator.ensureBase64Valid(unsafeContent)).toThrow(
        "O conteúdo indicado é inválido ou inseguro."
      );
    });

    it("should throw error if content is not valid base64", () => {
      const notBase64 = "not_base64_data";
      expect(() => MetaDataValidator.ensureBase64Valid(notBase64)).toThrow(
        "O conteúdo do arquivo deve estar em formato base64 válido."
      );
    });

    it("should not throw error if content is a safe and valid base64 string", () => {
      const validBase64 = "U29tZSB2YWxpZCBiYXNlNjQ=";
      expect(() =>
        MetaDataValidator.ensureBase64Valid(validBase64)
      ).not.toThrow();
    });
  });

  describe("ensureContentWithinLimit", () => {
    it("should throw error if content is empty", () => {
      const empty = "";
      expect(() => MetaDataValidator.ensureContentWithinLimit(empty)).toThrow(
        "O conteúdo indicado é inválido ou inseguro."
      );
    });

    it("should throw error if content exceeds max size", () => {
      const largeContent = "a".repeat(MAX_BASE64_SIZE + 1);
      expect(() =>
        MetaDataValidator.ensureContentWithinLimit(largeContent)
      ).toThrow("O conteúdo do arquivo execede o limite de 5MB.");
    });

    it("should not throw error if content is within size limit and not empty", () => {
      const validContent = "a".repeat(1000);
      expect(() =>
        MetaDataValidator.ensureContentWithinLimit(validContent)
      ).not.toThrow();
    });
  });
});
