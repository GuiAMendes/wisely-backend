// Validator
import { UserValidator } from "../../../domain/validator/user";

describe("UserValidator", () => {
  describe("ensureSafeName", () => {
    it("should throw error for unsafe name", () => {
      expect(() => UserValidator.ensureSafeName("DROP TABLE users")).toThrow(
        "Nome de usuário inseguro ou inválido."
      );
    });

    it("should not throw for safe name", () => {
      expect(() => UserValidator.ensureSafeName("João Silva")).not.toThrow();
    });
  });
});
