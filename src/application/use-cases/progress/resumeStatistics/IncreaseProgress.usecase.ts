// Service
import type { ProgressGateway } from "../../../../domain/gateway/progress/progress.gateway";
import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  ResumeStatisticsOfProgressUseCaseInputDTO,
  ResumeStatisticsOfProgressUseCaseOutputDTO,
} from "../../../../presentation/dtos/progress/resumeStatistics/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class ResumeStatisticsOfProgressUseCase
  implements
    Usecase<
      ResumeStatisticsOfProgressUseCaseInputDTO,
      ResumeStatisticsOfProgressUseCaseOutputDTO
    >
{
  constructor(private readonly progressGateway: ProgressGateway) {}

  public static create(progressGateway: ProgressGateway) {
    return new ResumeStatisticsOfProgressUseCase(progressGateway);
  }

  async execute({ idUser }: ResumeStatisticsOfProgressUseCaseInputDTO) {
    try {
      const progress = await this.progressGateway.resumeStatistics(idUser);

      if (!progress) throw new EntityNotFoundError("Progress is not found.");

      const output: ResumeStatisticsOfProgressUseCaseOutputDTO = {
        idUser,
        completedJourneys: progress.completedJourneys,
        completedTopics: progress.completedTopics,
        completionPercentage: progress.completionPercentage,
        journeysProgress: progress.journeysProgress,
        totalJourneys: progress.totalJourneys,
        totalTopics: progress.totalTopics,
      };

      return output;
    } catch (error) {
      console.error(
        "Error while resume statistics of progress from a journey:",
        error
      );
      throw new DatabaseError(
        "Failed to resume statistics of progress from a journey."
      );
    }
  }
}
