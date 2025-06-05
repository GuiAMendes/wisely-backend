import {
  prisma,
  uuidGenerator,
  jwtToken,
} from "../shared/factory/sharedFactory";

import { FileModelRepositoryPrisma } from "../infra/reporitory/prisma/fileModel/fileModel.repository";

import { CreateFileController } from "../presentation/controllers/express/fileModel/create/CreateFile.controller";
import { CreateFileUseCase } from "../application/use-cases/fileModel/create/CreateFile.usecase";
import { ListAllFilesController } from "../presentation/controllers/express/fileModel/listAll/ListAllFiles.controller";
import { ListAllFilesUseCase } from "../application/use-cases/fileModel/listAll/ListAllFiles.usecase";

export function createFileControllers() {
  const fileRepository = FileModelRepositoryPrisma.with(prisma);

  const create = CreateFileController.create(
    CreateFileUseCase.create(fileRepository, uuidGenerator),
    jwtToken
  );

  const listAll = ListAllFilesController.create(
    ListAllFilesUseCase.create(fileRepository),
    jwtToken
  );

  return [create, listAll];
}
