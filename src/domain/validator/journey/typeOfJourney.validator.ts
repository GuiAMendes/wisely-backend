// Constants
import { TYPE_OF_JOURNEY } from "../../constants/journey/journey.constants";

export class TypeOfJourneyValidator {
  public static ensureValidType(type: string) {
    if (!TYPE_OF_JOURNEY.includes(type))
      throw new Error("Tipo de jornada inválido.");
  }
}
