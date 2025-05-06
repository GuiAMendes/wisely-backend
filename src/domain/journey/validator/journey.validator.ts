// Validators
import {
  ensureSafe,
  ensureMinimalLenght,
  ensureNameWithinLimit,
} from "../../../shared/validators/validator.helpers";

// Constants
import { NAME_LENGTH } from "../constants";

export class JourneyValidator {
  static ensureSafeName(name: string) {
    ensureSafe(name, "O nome da jornada é insuro ou inválido.");
  }

  public static ensureJourneyNameHasMinimumLength(name: string) {
    ensureMinimalLenght(
      name,
      NAME_LENGTH.MIN,
      `Nome deve conter pelo menos ${NAME_LENGTH.MIN} caracteres.`
    );
  }

  public static ensureJourneyNameIsWithinLimit(name: string) {
    ensureNameWithinLimit(
      name,
      NAME_LENGTH.MAX,
      `Nome não pode exceder ${NAME_LENGTH.MAX} caracteres.`
    );
  }
}
