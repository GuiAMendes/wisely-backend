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

import { RenameDirectoryUseCase } from "../application/use-cases/directory/rename/RenameDirectory.usecase";
import { RenameDirectoryController } from "../presentation/controllers/express/directory/rename/RenameDirectory.controller";

import { UpdateDateOfAccessDirectoryUseCase } from "../application/use-cases/directory/updateDateOfAccess/UpdateDateOfAccessDirectory.usecase";
import { UpdateDateOfAccessDirectoryController } from "../presentation/controllers/express/directory/updateDate/UpdateDateOfAccessDirectory.controller";
import { FindByNameDirectoriesController } from "../presentation/controllers/express/directory/findByName/FindByNameDirectories.controller";
import { FindByNameDirectoriesUseCase } from "../application/use-cases/directory/findByName/FindByNameDirectories.usecase";
import { CompleteDirectoryController } from "../presentation/controllers/express/directory/complete/CompleteDirectory.controller";
import { CompleteDirectoryUseCase } from "../application/use-cases/directory/complete/CompleteDirectory.usecase";

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

  const rename = RenameDirectoryController.create(
    RenameDirectoryUseCase.create(directoryRepository)
  );

  const updateLastAccess = UpdateDateOfAccessDirectoryController.create(
    UpdateDateOfAccessDirectoryUseCase.create(directoryRepository)
  );

  const findByName = FindByNameDirectoriesController.create(
    FindByNameDirectoriesUseCase.create(directoryRepository),
    jwtToken
  );

  const markAsComplete = CompleteDirectoryController.create(
    CompleteDirectoryUseCase.create(directoryRepository)
  );

  return [
    create,
    listAll,
    listRecent,
    findByName,
    rename,
    updateLastAccess,
    markAsComplete,
  ];
}
