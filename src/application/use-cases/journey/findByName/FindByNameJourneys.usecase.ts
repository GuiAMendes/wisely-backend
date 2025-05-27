import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  FindByNameJourneysUseCaseInputDTO,
  FindByNameJourneysUseCaseOutputDTO,
} from "../../../../presentation/dtos/journey/findByName/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { JourneyGateway } from "../../../../domain/gateway/journey/journey.gateway";

export class FindByNameJourneysUseCase
  implements
    Usecase<
      FindByNameJourneysUseCaseInputDTO,
      FindByNameJourneysUseCaseOutputDTO
    >
{
  constructor(private readonly journeyGateway: JourneyGateway) {}

  public static create(journeyGateway: JourneyGateway) {
    return new FindByNameJourneysUseCase(journeyGateway);
  }

  async execute({
    idDirectory,
    journeyName,
  }: FindByNameJourneysUseCaseInputDTO) {
    try {
      const journeys = await this.journeyGateway.findByName(
        idDirectory,
        journeyName
      );
      const output: FindByNameJourneysUseCaseOutputDTO = {
        journeys,
      };

      return output;
    } catch (error) {
      console.error("Error while restore directories by name:", error);
      throw new DatabaseError("Failed to restore directories by name.");
    }
  }
}
