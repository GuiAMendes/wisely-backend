import {
  prisma,
  uuidGenerator,
  jwtToken,
} from "../shared/factory/sharedFactory";

import { FileModelRepositoryPrisma } from "../infra/reporitory/prisma/fileModel/fileModel.repository";

import { CreateFileController } from "../presentation/controllers/express/fileModel/create/CreateFile.controller";
import { CreateFileUseCase } from "../application/use-cases/fileModel/create/CreateFile.usecase";

export function createFileControllers() {
  const fileRepository = FileModelRepositoryPrisma.with(prisma);

  const create = CreateFileController.create(
    CreateFileUseCase.create(fileRepository, uuidGenerator),
    jwtToken
  );

  return [create];
}
