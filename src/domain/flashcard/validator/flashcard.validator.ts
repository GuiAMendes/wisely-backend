// Validators
import {
  ensureSafe,
  ensureMinimalLenght,
  ensureNameWithinLimit,
} from "../../../shared/validators/validator.helpers";

// Constants
import {
  QUESTION_INTERVAL_LENGTH,
  RESPONSE_INTERVAL_LENGTH,
} from "../constants";

export class FlashcardValidator {
  public static ensureValidQuestion(value: string) {
    ensureSafe(value, "A pergunta contém conteúdo inseguro ou inválido.");
    ensureMinimalLenght(
      value,
      QUESTION_INTERVAL_LENGTH.MIN,
      `A pergunta deve ter no mínimo ${QUESTION_INTERVAL_LENGTH.MIN} caracteres.`
    );
    ensureNameWithinLimit(
      value,
      QUESTION_INTERVAL_LENGTH.MAX,
      `A pergunta não pode exceder ${QUESTION_INTERVAL_LENGTH.MAX} caracteres.`
    );
  }

  public static ensureValidResponse(value: string) {
    ensureSafe(value, "A resposta contém conteúdo inseguro ou inválido.");
    ensureMinimalLenght(
      value,
      RESPONSE_INTERVAL_LENGTH.MIN,
      `A resposta deve ter no mínimo ${RESPONSE_INTERVAL_LENGTH.MIN} caracteres.`
    );
    ensureNameWithinLimit(
      value,
      RESPONSE_INTERVAL_LENGTH.MAX,
      `A resposta não pode exceder ${RESPONSE_INTERVAL_LENGTH.MAX} caracteres.`
    );
  }
}
