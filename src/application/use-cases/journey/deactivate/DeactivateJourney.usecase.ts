// Service
import { JourneyGateway } from "../../../../domain/gateway/journey/journey.gateway";

// Interface
import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import {
  DeactivateJourneyUseCaseInputDTO,
  DeactivateJourneyUseCaseOutputDTO,
} from "../../../../presentation/dtos/journey/deactivate/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class DeactivateJourneyUseCase
  implements
    Usecase<
      DeactivateJourneyUseCaseInputDTO,
      DeactivateJourneyUseCaseOutputDTO
    >
{
  constructor(private readonly journeyGateway: JourneyGateway) {}

  public static create(journeyGateway: JourneyGateway) {
    return new DeactivateJourneyUseCase(journeyGateway);
  }

  async execute({ idJourney }: DeactivateJourneyUseCaseInputDTO) {
    try {
      const journeyAlreadyExists = await this.journeyGateway.findById(
        idJourney
      );

      if (!journeyAlreadyExists)
        throw new EntityNotFoundError("Journey is not found.");

      const completedJourney = journeyAlreadyExists.deactivate();

      await this.journeyGateway.deactivate(idJourney);
      const output: DeactivateJourneyUseCaseOutputDTO = {
        idJourney,
        status: completedJourney.isActive,
      };

      return output;
    } catch (error) {
      console.error("Error while deactivate Journey:", error);
      throw new Error("Failed to deactivate Journey.");
    }
  }
}
