import {
  prisma,
  uuidGenerator,
  jwtToken,
} from "../shared/factory/sharedFactory";

import { TopicRepositoryPrisma } from "../infra/reporitory/prisma/topic/topic.repository";

import { CreateTopicController } from "../presentation/controllers/express/topic/create/CreateTopic.controller";
import { CreateTopicUseCase } from "../application/use-cases/topic/create/CreateTopic.usecase";
import { ListAllTopicsController } from "../presentation/controllers/express/topic/listAll/ListAllTopics.controller";
import { ListAllTopicsUseCase } from "../application/use-cases/topic/listAll/ListAllTopics.usecase";
import { RenameTopicController } from "../presentation/controllers/express/topic/rename/RenameTopic.controller";
import { RenameTopicUseCase } from "../application/use-cases/topic/rename/RenameTopic.usecase";
import { DeactivateTopicController } from "../presentation/controllers/express/topic/deactivate/DeactivateTopic.controller";
import { DeactivateTopicUseCase } from "../application/use-cases/topic/deactivate/DeactivateTopic.usecase";

export function createTopicControllers() {
  const topicRepository = TopicRepositoryPrisma.with(prisma);

  const create = CreateTopicController.create(
    CreateTopicUseCase.create(topicRepository, uuidGenerator),
    jwtToken
  );

  const listAll = ListAllTopicsController.create(
    ListAllTopicsUseCase.create(topicRepository),
    jwtToken
  );

  const rename = RenameTopicController.create(
    RenameTopicUseCase.create(topicRepository),
    jwtToken
  );

  const deactivate = DeactivateTopicController.create(
    DeactivateTopicUseCase.create(topicRepository),
    jwtToken
  );

  return [create, listAll, rename, deactivate];
}
