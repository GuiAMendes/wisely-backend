// Service
import type { ProgressGateway } from "../../../../domain/gateway/progress/progress.gateway";
import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  IncreaseProgressUseCaseInputDTO,
  IncreaseProgressUseCaseOutputDTO,
} from "../../../../presentation/dtos/progress/increaseCompleted/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class IncreaseProgressUseCase
  implements
    Usecase<IncreaseProgressUseCaseInputDTO, IncreaseProgressUseCaseOutputDTO>
{
  constructor(private readonly progressGateway: ProgressGateway) {}

  public static create(progressGateway: ProgressGateway) {
    return new IncreaseProgressUseCase(progressGateway);
  }

  async execute({ idJourney }: IncreaseProgressUseCaseInputDTO) {
    try {
      const progress = await this.progressGateway.findByJourney(idJourney);

      if (!progress) throw new EntityNotFoundError("Progress is not found.");

      const updatedProgress = progress.updateCompletedTopics();

      await this.progressGateway.increaseCompleted(idJourney);

      const output: IncreaseProgressUseCaseOutputDTO = {
        idJourney: updatedProgress.journeyId,
        completedTopics: updatedProgress.completedTopics,
        totalTopics: updatedProgress.totalTopics,
      };

      return output;
    } catch (error) {
      console.error("Error while updating progress from a journey:", error);
      throw new DatabaseError("Failed to update progress from a journey.");
    }
  }
}
