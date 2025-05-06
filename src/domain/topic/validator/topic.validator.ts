// Validators
import {
  ensureSafe,
  ensureMinimalLenght,
  ensureNameWithinLimit,
} from "../../../shared/validators/validator.helpers";

// Constants
import { TOPIC_NAME_LENGTH } from "../constants";

export class TopicValidator {
  static ensureSafeName(name: string) {
    ensureSafe(name, "O nome do tópico é inseguro ou inválido.");
  }

  public static ensureTopicNameHasMinimumLength(name: string) {
    ensureMinimalLenght(
      name,
      TOPIC_NAME_LENGTH.MIN,
      `Nome do tópico deve conter pelo menos ${TOPIC_NAME_LENGTH.MIN} caracteres.`
    );
  }

  public static ensureTopicNameIsWithinLimit(name: string) {
    ensureNameWithinLimit(
      name,
      TOPIC_NAME_LENGTH.MAX,
      `Nome do tópico não pode exceder ${TOPIC_NAME_LENGTH.MAX} caracteres.`
    );
  }
}
