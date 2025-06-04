// Service
import { TopicGateway } from "../../../../domain/gateway/topic/topic.gateway";

import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import {
  RenameTopicUseCaseInputDTO,
  RenameTopicUseCaseOutputDTO,
} from "../../../../presentation/dtos/topic/rename/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class RenameTopicUseCase
  implements Usecase<RenameTopicUseCaseInputDTO, RenameTopicUseCaseOutputDTO>
{
  constructor(private readonly topicGateway: TopicGateway) {}

  public static create(topicGateway: TopicGateway) {
    return new RenameTopicUseCase(topicGateway);
  }

  async execute({ idTopic, newTopicName }: RenameTopicUseCaseInputDTO) {
    try {
      const topicAlreadyExists = await this.topicGateway.findById(idTopic);

      if (!topicAlreadyExists)
        throw new EntityNotFoundError("Topic is not found.");

      const renamedTopic = topicAlreadyExists.rename(newTopicName);

      await this.topicGateway.updateName(idTopic, renamedTopic.topicName);
      const output: RenameTopicUseCaseOutputDTO = {
        idTopic,
        topicName: renamedTopic.topicName,
      };

      return output;
    } catch (error) {
      console.error("Error while rename Topic:", error);
      throw new Error("Failed to rename Topic.");
    }
  }
}
