// Service
import { JourneyGateway } from "../../../../domain/gateway/journey/journey.gateway";

// Interface
import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  ListAllJourneysAccessedRecentlyUseCaseInputDTO,
  ListAllJourneysAccessedRecentlyUseCaseOutputDTO,
} from "../../../../presentation/dtos/journey/listRecents/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";

export class ListAllJourneyAccessedRecentlyUseCase
  implements
    Usecase<
      ListAllJourneysAccessedRecentlyUseCaseInputDTO,
      ListAllJourneysAccessedRecentlyUseCaseOutputDTO
    >
{
  constructor(private readonly journeyGateway: JourneyGateway) {}

  public static create(journeyGateway: JourneyGateway) {
    return new ListAllJourneyAccessedRecentlyUseCase(journeyGateway);
  }

  async execute({
    idDirectory,
  }: ListAllJourneysAccessedRecentlyUseCaseInputDTO) {
    try {
      const journeys = await this.journeyGateway.listRecentAccess(idDirectory);
      const output: ListAllJourneysAccessedRecentlyUseCaseOutputDTO = {
        journeys,
      };

      return output;
    } catch (error) {
      console.error("Error while restore journeys:", error);
      throw new DatabaseError("Failed to restore journeys.");
    }
  }
}
