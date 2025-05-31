import { prisma, jwtToken } from "../shared/factory/sharedFactory";

import { ProgressRepositoryPrisma } from "../infra/reporitory/prisma/progress/progress.repository";

import { CreateProgressController } from "../presentation/controllers/express/progress/create/CreateProgress.controller";
import { CreateProgressUseCase } from "../application/use-cases/progress/create/CreateProgress.usecase";

export function createprogressControllers() {
  const progressRepository = ProgressRepositoryPrisma.with(prisma);

  const create = CreateProgressController.create(
    CreateProgressUseCase.create(progressRepository),
    jwtToken
  );

  return [create];
}
