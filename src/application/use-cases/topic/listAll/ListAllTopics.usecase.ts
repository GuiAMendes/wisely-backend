import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  ListAllTopicsUseCaseInputDTO,
  ListAllTopicsUseCaseOutputDTO,
} from "../../../../presentation/dtos/topic/listAll/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { TopicGateway } from "../../../../domain/gateway/topic/topic.gateway";

export class ListAllTopicsUseCase
  implements
    Usecase<ListAllTopicsUseCaseInputDTO, ListAllTopicsUseCaseOutputDTO>
{
  constructor(private readonly topicGateway: TopicGateway) {}

  public static create(topicGateway: TopicGateway) {
    return new ListAllTopicsUseCase(topicGateway);
  }

  async execute({ idJourney }: ListAllTopicsUseCaseInputDTO) {
    try {
      const topics = await this.topicGateway.listAll(idJourney);
      const output: ListAllTopicsUseCaseOutputDTO = {
        topics,
      };

      return output;
    } catch (error) {
      console.error("Error while restore topics:", error);
      throw new DatabaseError("Failed to restore topics.");
    }
  }
}
