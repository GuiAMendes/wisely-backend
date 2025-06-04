import {
  prisma,
  uuidGenerator,
  jwtToken,
} from "../shared/factory/sharedFactory";

import { SummaryRepositoryPrisma } from "../infra/reporitory/prisma/summary/summary.repository";

import { CreateSummaryController } from "../presentation/controllers/express/summary/create/CreateSummary.controller";
import { CreateSummaryUseCase } from "../application/use-cases/summary/create/CreateSummary.usecase";
import { FindByTopicSummaryController } from "../presentation/controllers/express/summary/findByTopic/FindByTopicSummary.controller";
import { FindByTopicSummaryUseCase } from "../application/use-cases/summary/findByTopic/FindByTopicSummary.usecase";

export function createSummaryControllers() {
  const summaryRepository = SummaryRepositoryPrisma.with(prisma);

  const create = CreateSummaryController.create(
    CreateSummaryUseCase.create(summaryRepository, uuidGenerator),
    jwtToken
  );

  const findByTopic = FindByTopicSummaryController.create(
    FindByTopicSummaryUseCase.create(summaryRepository),
    jwtToken
  );

  return [create, findByTopic];
}
