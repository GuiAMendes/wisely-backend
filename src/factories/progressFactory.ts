import { prisma, jwtToken } from "../shared/factory/sharedFactory";

import { ProgressRepositoryPrisma } from "../infra/reporitory/prisma/progress/progress.repository";

import { CreateProgressController } from "../presentation/controllers/express/progress/create/CreateProgress.controller";
import { CreateProgressUseCase } from "../application/use-cases/progress/create/CreateProgress.usecase";

import { IncreaseProgressController } from "../presentation/controllers/express/progress/increaseCompleted/IncreaseProgress.controller";
import { IncreaseProgressUseCase } from "../application/use-cases/progress/increase/IncreaseProgress.usecase";

export function createprogressControllers() {
  const progressRepository = ProgressRepositoryPrisma.with(prisma);

  const create = CreateProgressController.create(
    CreateProgressUseCase.create(progressRepository),
    jwtToken
  );

  const increase = IncreaseProgressController.create(
    IncreaseProgressUseCase.create(progressRepository),
    jwtToken
  );

  return [create, increase];
}
