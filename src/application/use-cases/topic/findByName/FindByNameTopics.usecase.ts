import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  FindByNameTopicsUseCaseInputDTO,
  FindByNameTopicsUseCaseOutputDTO,
} from "../../../../presentation/dtos/topic/findByName/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { TopicGateway } from "../../../../domain/gateway/topic/topic.gateway";

export class FindByNameTopicsUseCase
  implements
    Usecase<FindByNameTopicsUseCaseInputDTO, FindByNameTopicsUseCaseOutputDTO>
{
  constructor(private readonly topicGateway: TopicGateway) {}

  public static create(topicGateway: TopicGateway) {
    return new FindByNameTopicsUseCase(topicGateway);
  }

  async execute({ idJourney, topicName }: FindByNameTopicsUseCaseInputDTO) {
    try {
      const topics = await this.topicGateway.findByName(idJourney, topicName);
      const output: FindByNameTopicsUseCaseOutputDTO = {
        topics,
      };

      return output;
    } catch (error) {
      console.error("Error while restore topics by name:", error);
      throw new DatabaseError("Failed to restore topics by name.");
    }
  }
}
