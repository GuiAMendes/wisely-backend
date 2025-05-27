// Service
import { JourneyGateway } from "../../../../domain/gateway/journey/journey.gateway";

import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import {
  RenameJourneyUseCaseInputDTO,
  RenameJourneyUseCaseOutputDTO,
} from "../../../../presentation/dtos/journey/rename/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class RenameJourneyUseCase
  implements
    Usecase<RenameJourneyUseCaseInputDTO, RenameJourneyUseCaseOutputDTO>
{
  constructor(private readonly journeyGateway: JourneyGateway) {}

  public static create(journeyGateway: JourneyGateway) {
    return new RenameJourneyUseCase(journeyGateway);
  }

  async execute({ idJourney, newJourneyName }: RenameJourneyUseCaseInputDTO) {
    try {
      const journeyAlreadyExists = await this.journeyGateway.findById(
        idJourney
      );

      if (!journeyAlreadyExists)
        throw new EntityNotFoundError("Journey is not found.");

      const renamedJourney = journeyAlreadyExists.rename(newJourneyName);

      await this.journeyGateway.updateName(
        idJourney,
        renamedJourney.journeyName
      );
      const output: RenameJourneyUseCaseOutputDTO = {
        idJourney,
        journeyName: renamedJourney.journeyName,
      };

      return output;
    } catch (error) {
      console.error("Error while rename journey:", error);
      throw new Error("Failed to rename journey.");
    }
  }
}
