// Service
import { TopicGateway } from "../../../../domain/gateway/topic/topic.gateway";

import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import {
  DeactivateTopicUseCaseInputDTO,
  DeactivateTopicUseCaseOutputDTO,
} from "../../../../presentation/dtos/topic/deactivate/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class DeactivateTopicUseCase
  implements
    Usecase<DeactivateTopicUseCaseInputDTO, DeactivateTopicUseCaseOutputDTO>
{
  constructor(private readonly topicGateway: TopicGateway) {}

  public static create(topicGateway: TopicGateway) {
    return new DeactivateTopicUseCase(topicGateway);
  }

  async execute({ idTopic }: DeactivateTopicUseCaseInputDTO) {
    try {
      const topicAlreadyExists = await this.topicGateway.findById(idTopic);

      if (!topicAlreadyExists)
        throw new EntityNotFoundError("Topic is not found.");

      const deactivateTopic = topicAlreadyExists.deactivate();

      await this.topicGateway.deactivate(idTopic);
      const output: DeactivateTopicUseCaseOutputDTO = {
        idTopic,
        status: deactivateTopic.isActive,
      };

      return output;
    } catch (error) {
      console.error("Error while deactivate Topic:", error);
      throw new Error("Failed to deactivate Topic.");
    }
  }
}
