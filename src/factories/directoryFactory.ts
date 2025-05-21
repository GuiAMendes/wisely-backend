import {
  prisma,
  uuidGenerator,
  jwtToken,
} from "../shared/factory/sharedFactory";

import { DirectoryRepositoryPrisma } from "../infra/reporitory/prisma/directory/directory.repository";

import { CreateDirectoryUseCase } from "../application/use-cases/directory/create/CreateDirectory.usecase";
import { CreateDirectoryController } from "../presentation/controllers/express/directory/create/CreateDirectory.controller";

import { ListAllDirectoriesUseCase } from "../application/use-cases/directory/listAll/ListAllDirectories.usecase";
import { ListAllDirectoriesController } from "../presentation/controllers/express/directory/listAll/ListAllDirectories.controller";

import { ListDirectoriesAccessedRecentlyUseCase } from "../application/use-cases/directory/listRecents/ListAllDirectories.usecase";
import { ListDirectoriesAccessedRecentlyController } from "../presentation/controllers/express/directory/listRecents/ListDirectoriesAccessedRecently.controller";

export function createDirectoryControllers() {
  const directoryRepository = DirectoryRepositoryPrisma.with(prisma);

  const create = CreateDirectoryController.create(
    CreateDirectoryUseCase.create(directoryRepository, uuidGenerator),
    jwtToken
  );

  const listAll = ListAllDirectoriesController.create(
    ListAllDirectoriesUseCase.create(directoryRepository),
    jwtToken
  );

  const listRecent = ListDirectoriesAccessedRecentlyController.create(
    ListDirectoriesAccessedRecentlyUseCase.create(directoryRepository),
    jwtToken
  );

  return [create, listAll, listRecent];
}
