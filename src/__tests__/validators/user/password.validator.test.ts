// Validator
import { PasswordValidator } from "../../../domain/validator/user";

// Constants
import { MINIMAL_LENGHT } from "../../../domain/constants/user/password.constants";

describe("PasswordValidator", () => {
  describe("ensureSafeContent", () => {
    it("should throw error for unsafe password", () => {
      expect(() => PasswordValidator.ensureSafeContent("DROP TABLE")).toThrow(
        "Senha insegura ou vazia."
      );
    });

    it("should not throw for safe password", () => {
      expect(() =>
        PasswordValidator.ensureSafeContent("SenhaSegura123!")
      ).not.toThrow();
    });
  });

  describe("ensureMinimalLenght", () => {
    it("should throw error for empty password", () => {
      expect(() => PasswordValidator.ensureMinimalLenght("")).toThrow(
        `Senha deve ter ao menos ${MINIMAL_LENGHT} caracteres.`
      );
    });

    it(`should throw error for password shorter than ${MINIMAL_LENGHT}`, () => {
      expect(() => PasswordValidator.ensureMinimalLenght("123")).toThrow(
        `Senha deve ter ao menos ${MINIMAL_LENGHT} caracteres.`
      );
    });

    it("should not throw for password with minimal length", () => {
      const validPassword = "a".repeat(MINIMAL_LENGHT);
      expect(() =>
        PasswordValidator.ensureMinimalLenght(validPassword)
      ).not.toThrow();
    });
  });

  describe("ensureRequiredCharacters", () => {
    it("should throw error if missing uppercase letter", () => {
      expect(() =>
        PasswordValidator.ensureRequiredCharacters("senha123!")
      ).toThrow("Senha deve conter ao menos uma letra maiúscula.");
    });

    it("should throw error if missing special character", () => {
      expect(() =>
        PasswordValidator.ensureRequiredCharacters("Senha123")
      ).toThrow("Senha deve conter ao menos um caractere especial.");
    });

    it("should throw error if missing number", () => {
      expect(() =>
        PasswordValidator.ensureRequiredCharacters("Senha!")
      ).toThrow("Senha deve conter ao menos um número.");
    });

    it("should not throw for valid password", () => {
      expect(() =>
        PasswordValidator.ensureRequiredCharacters("Senha123!")
      ).not.toThrow();
    });
  });
});
