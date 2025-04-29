// Validators
import { ensureSafe } from "../../../shared/validators/index";

export class UserValidator {
  public static ensureSafeName(name: string) {
    ensureSafe(name, "Nome de usuário inseguro ou inválido.");
  }
}
