// Service
import { TopicGateway } from "../../../../domain/gateway/topic/topic.gateway";

import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import {
  CompleteTopicUseCaseInputDTO,
  CompleteTopicUseCaseOutputDTO,
} from "../../../../presentation/dtos/topic/complete/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class CompleteTopicUseCase
  implements
    Usecase<CompleteTopicUseCaseInputDTO, CompleteTopicUseCaseOutputDTO>
{
  constructor(private readonly topicGateway: TopicGateway) {}

  public static create(topicGateway: TopicGateway) {
    return new CompleteTopicUseCase(topicGateway);
  }

  async execute({ idTopic }: CompleteTopicUseCaseInputDTO) {
    try {
      const topicAlreadyExists = await this.topicGateway.findById(idTopic);

      if (!topicAlreadyExists)
        throw new EntityNotFoundError("topic is not found.");

      const completedtopic = topicAlreadyExists.complete();

      await this.topicGateway.complete(idTopic);
      const output: CompleteTopicUseCaseOutputDTO = {
        idTopic,
        status: completedtopic.isConcluded,
      };

      return output;
    } catch (error) {
      console.error("Error while marking is complete status in topic:", error);
      throw new Error("Failed to marking is complete status in topic.");
    }
  }
}
