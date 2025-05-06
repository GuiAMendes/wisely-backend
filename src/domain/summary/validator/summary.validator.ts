// Validators
import {
  ensureSafe,
  ensureMinimalLenght,
  ensureNameWithinLimit,
} from "../../../shared/validators/validator.helpers";

// Constants
import { SUMMARY_TITLE_LENGTH } from "../constants/summary.constants";

export class SummaryValidator {
  static ensureSafeTitle(title: string) {
    ensureSafe(title, "Título inválido ou inseguro.");
  }

  static ensureMinimalTitle(title: string) {
    ensureMinimalLenght(title, SUMMARY_TITLE_LENGTH.MIN, "Título muito curto.");
  }

  static ensureTitleWithinLimit(title: string) {
    ensureNameWithinLimit(
      title,
      SUMMARY_TITLE_LENGTH.MAX,
      "Título muito longo."
    );
  }
}
