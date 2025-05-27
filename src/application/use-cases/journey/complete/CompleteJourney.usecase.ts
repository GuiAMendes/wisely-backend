// Service
import { JourneyGateway } from "../../../../domain/gateway/journey/journey.gateway";

import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import {
  CompleteJourneyUseCaseInputDTO,
  CompleteJourneyUseCaseOutputDTO,
} from "../../../../presentation/dtos/journey/complete/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class CompleteJourneyUseCase
  implements
    Usecase<CompleteJourneyUseCaseInputDTO, CompleteJourneyUseCaseOutputDTO>
{
  constructor(private readonly journeyGateway: JourneyGateway) {}

  public static create(journeyGateway: JourneyGateway) {
    return new CompleteJourneyUseCase(journeyGateway);
  }

  async execute({ idJourney }: CompleteJourneyUseCaseInputDTO) {
    try {
      const journeyAlreadyExists = await this.journeyGateway.findById(
        idJourney
      );

      if (!journeyAlreadyExists)
        throw new EntityNotFoundError("journey is not found.");

      const completedjourney = journeyAlreadyExists.complete();

      await this.journeyGateway.complete(idJourney);
      const output: CompleteJourneyUseCaseOutputDTO = {
        idJourney,
        status: completedjourney.isCompleted,
      };

      return output;
    } catch (error) {
      console.error(
        "Error while marking is complete status in journey:",
        error
      );
      throw new Error("Failed to marking is complete status in journey.");
    }
  }
}
