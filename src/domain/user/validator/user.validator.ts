// Validators
import { isSafe } from "../../../shared/validators/index";

export class UserValidator {
  public static ensureSafeName(name: string) {
    if (!isSafe(name)) {
      throw new Error("Nome de usuário inseguro ou inválido.");
    }
  }
}
