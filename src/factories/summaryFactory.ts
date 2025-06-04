import {
  prisma,
  uuidGenerator,
  jwtToken,
} from "../shared/factory/sharedFactory";

import { SummaryRepositoryPrisma } from "../infra/reporitory/prisma/summary/summary.repository";

import { CreateSummaryController } from "../presentation/controllers/express/summary/create/CreateSummary.controller";
import { CreateSummaryUseCase } from "../application/use-cases/summary/create/CreateSummary.usecase";

export function createSummaryControllers() {
  const summaryRepository = SummaryRepositoryPrisma.with(prisma);

  const create = CreateSummaryController.create(
    CreateSummaryUseCase.create(summaryRepository, uuidGenerator),
    jwtToken
  );

  return [create];
}
