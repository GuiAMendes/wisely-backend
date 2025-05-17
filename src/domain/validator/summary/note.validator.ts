// Validators
import {
  ensureSafe,
  isEmpty,
} from "../../../shared/validators/validator.helpers";

export class NoteValidator {
  static ensureSafeContent(content: string) {
    ensureSafe(content, "Conteúdo inseguro ou inválido.");
  }

  static ensureNotEmpty(content: string) {
    if (isEmpty(content)) throw new Error("A nota não pode estar vazia.");
  }
}
