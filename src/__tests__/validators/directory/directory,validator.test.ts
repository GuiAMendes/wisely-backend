// Validator
import { DirectoryValidator } from "../../../domain/validator/directory/directory.validator";

describe("DirectoryValidator", () => {
  describe("ensureSafeName", () => {
    it("should throw error for unsafe directory name", () => {
      expect(() =>
        DirectoryValidator.ensureSafeName("DROP DATABASE wisely")
      ).toThrow("O nome do diretório é inseguro ou inválido.");
    });

    it("should not throw for safe directory name", () => {
      expect(() =>
        DirectoryValidator.ensureSafeName("Learning NextJS")
      ).not.toThrow();
    });
  });
});
