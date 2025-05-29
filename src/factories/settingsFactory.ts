import { prisma, jwtToken } from "../shared/factory/sharedFactory";

import { SettingsRepositoryPrisma } from "../infra/reporitory/prisma/settings/settings.repository";

import { CreateSettingsController } from "../presentation/controllers/express/settings/create/CreateSettings.controller";
import { CreateSettingsUseCase } from "../application/use-cases/settings/create/CreateSettings.usecase";

import { FindByUserSettingsController } from "../presentation/controllers/express/settings/findByUser/FindByUserSettings.controller";
import { FindByUserSettingsUseCase } from "../application/use-cases/settings/findByUser/FindByUserSettings.usecase";

export function createSettingsControllers() {
  const settingsRepository = SettingsRepositoryPrisma.with(prisma);

  const create = CreateSettingsController.create(
    CreateSettingsUseCase.create(settingsRepository),
    jwtToken
  );

  const findByUser = FindByUserSettingsController.create(
    FindByUserSettingsUseCase.create(settingsRepository),
    jwtToken
  );

  return [create, findByUser];
}
