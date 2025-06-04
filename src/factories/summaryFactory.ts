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

import { RenameTitleOfSummaryController } from "../presentation/controllers/express/summary/renameTitle/RenameTitleOfSummary.controller";
import { RenameTitleOfSummaryUseCase } from "../application/use-cases/summary/renameTitle/RenameTitleOfSummary.usecase";
import { UpdateContentOfSummaryController } from "../presentation/controllers/express/summary/updateContent/UpdateContentOfSummary.controller";
import { UpdateContentOfSummaryUseCase } from "../application/use-cases/summary/updateContent/UpdateContentOfSummary.usecase";

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

  const renameTitle = RenameTitleOfSummaryController.create(
    RenameTitleOfSummaryUseCase.create(summaryRepository),
    jwtToken
  );

  const editContent = UpdateContentOfSummaryController.create(
    UpdateContentOfSummaryUseCase.create(summaryRepository),
    jwtToken
  );

  return [create, findByTopic, renameTitle, editContent];
}
