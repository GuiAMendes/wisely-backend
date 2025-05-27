// Service
import { JourneyGateway } from "../../../../domain/gateway/journey/journey.gateway";

// Interface
import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import {
  UpdateDateOfAccessJourneyUseCaseInputDTO,
  UpdateDateOfAccessJourneyUseCaseOutputDTO,
} from "../../../../presentation/dtos/journey/updateDate/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class UpdateDateOfAccessJourneyUseCase
  implements
    Usecase<
      UpdateDateOfAccessJourneyUseCaseInputDTO,
      UpdateDateOfAccessJourneyUseCaseOutputDTO
    >
{
  constructor(private readonly journeyGateway: JourneyGateway) {}

  public static create(journeyGateway: JourneyGateway) {
    return new UpdateDateOfAccessJourneyUseCase(journeyGateway);
  }

  async execute({ idJourney }: UpdateDateOfAccessJourneyUseCaseInputDTO) {
    try {
      const JourneyAlreadyExists = await this.journeyGateway.findById(
        idJourney
      );

      if (!JourneyAlreadyExists)
        throw new EntityNotFoundError("Journey is not found.");

      await this.journeyGateway.updateDateOfAccess(idJourney);
      const output: UpdateDateOfAccessJourneyUseCaseOutputDTO = {
        idJourney,
      };

      return output;
    } catch (error) {
      console.error("Error while update date of access in Journey:", error);
      throw new Error("Failed to update date of access in Journey.");
    }
  }
}
