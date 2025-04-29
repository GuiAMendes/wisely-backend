// Validators
import { ensureSafe } from "../../../../shared/validators/index";

export class DirectoryValidator {
  public static ensureSafeName(name: string) {
    ensureSafe(name, "O nome do diretório é inseguro ou inválido.");
  }
}
