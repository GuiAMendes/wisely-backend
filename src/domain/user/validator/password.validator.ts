// Validators
import { isEmpty, isSafe } from "../../../shared/validators/index";

// Constants
import { MINIMAL_LENGHT } from "../constants/password.constants";

export class PasswordValidator {
  public static ensureSafeContent(plaintext: string) {
    if (!isSafe(plaintext)) {
      throw new Error("Senha insegura ou vazia.");
    }
  }

  public static ensureMinimalLenght(plaintext: string) {
    if (isEmpty(plaintext) || plaintext.length < MINIMAL_LENGHT) {
      throw new Error(`Senha deve ter ao menos ${MINIMAL_LENGHT} caracteres.`);
    }
  }

  public static ensureRequiredCharacters(plaintext: string) {
    const hasSpecialChar = /[^A-Za-z0-9]/.test(plaintext);
    const hasUpperCase = /[A-Z]/.test(plaintext);
    const hasNumber = /[0-9]/.test(plaintext);

    if (!hasUpperCase)
      throw new Error("Senha deve conter ao menos uma letra maiúscula.");
    if (!hasSpecialChar)
      throw new Error("Senha deve conter ao menos um caractere especial.");
    if (!hasNumber) throw new Error("Senha deve conter ao menos um número.");
  }
}
