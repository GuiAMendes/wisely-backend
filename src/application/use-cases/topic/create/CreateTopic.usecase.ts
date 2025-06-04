// Entity
import { Topic } from "../../../../domain/entity/topic/Topic";

// Interfaces
import { UuidGenerator } from "../../../../infra/services/uuid/interfaces/UuidGenerator.interfaces";

// Service
import type { Usecase } from "../../interface/usecase.interface";

// Gateway
import { TopicGateway } from "../../../../domain/gateway/topic/topic.gateway";

// DTOS
import type {
  CreateTopicUseCaseInputDTO,
  CreateTopicUseCaseOutputDTO,
} from "../../../../presentation/dtos/topic/create/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";

export class CreateTopicUseCase
  implements Usecase<CreateTopicUseCaseInputDTO, CreateTopicUseCaseOutputDTO>
{
  constructor(
    private readonly topicGateway: TopicGateway,
    private readonly uuidService: UuidGenerator
  ) {}

  public static create(topicGateway: TopicGateway, uuidService: UuidGenerator) {
    return new CreateTopicUseCase(topicGateway, uuidService);
  }

  async execute({ idJourney, name }: CreateTopicUseCaseInputDTO) {
    try {
      const topic = Topic.create({
        idJourney,
        topicName: name,
        uuidGenerator: this.uuidService,
      });

      await this.topicGateway.create(topic);
      const output: CreateTopicUseCaseOutputDTO = {
        id: topic.id,
      };

      return output;
    } catch (error) {
      console.error("Error while creating Topic:", error);
      throw new DatabaseError("Failed to create Topic.");
    }
  }
}
