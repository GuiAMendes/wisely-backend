// Service
import type { SummaryGateway } from "../../../../domain/gateway/summary/summary.gateway";
import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  FindByTopicSummaryUseCaseInputDTO,
  FindByTopicSummaryUseCaseOutputDTO,
} from "../../../../presentation/dtos/summary/findByTopic/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class FindByTopicSummaryUseCase
  implements
    Usecase<
      FindByTopicSummaryUseCaseInputDTO,
      FindByTopicSummaryUseCaseOutputDTO
    >
{
  constructor(private readonly summaryGateway: SummaryGateway) {}

  public static create(summaryGateway: SummaryGateway) {
    return new FindByTopicSummaryUseCase(summaryGateway);
  }

  async execute({ idTopic }: FindByTopicSummaryUseCaseInputDTO) {
    try {
      const summary = await this.summaryGateway.findByTopic(idTopic);

      if (!summary) throw new EntityNotFoundError("Summary is not found");

      const output: FindByTopicSummaryUseCaseOutputDTO = {
        summary,
      };

      return output;
    } catch (error) {
      console.error("Error while find user settings:", error);
      throw new DatabaseError("Failed to find user settings.");
    }
  }
}
