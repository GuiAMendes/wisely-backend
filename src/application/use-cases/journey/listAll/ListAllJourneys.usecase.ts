// Service
import { JourneyGateway } from "../../../../domain/gateway/journey/journey.gateway";

// Interface
import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  ListAllJourneysUseCaseInputDTO,
  ListAllJourneysUseCaseOutputDTO,
} from "../../../../presentation/dtos/journey/listAll/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";

export class ListAllJourneysUseCase
  implements
    Usecase<ListAllJourneysUseCaseInputDTO, ListAllJourneysUseCaseOutputDTO>
{
  constructor(private readonly journeyGateway: JourneyGateway) {}

  public static create(journeyGateway: JourneyGateway) {
    return new ListAllJourneysUseCase(journeyGateway);
  }

  async execute({ idDirectory }: ListAllJourneysUseCaseInputDTO) {
    try {
      const journeys = await this.journeyGateway.listAll(idDirectory);
      const output: ListAllJourneysUseCaseOutputDTO = {
        journeys,
      };

      return output;
    } catch (error) {
      console.error("Error while restore journeys:", error);
      throw new DatabaseError("Failed to restore journeys.");
    }
  }
}
