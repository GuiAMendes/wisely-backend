import {
  jwtToken,
  bcrypt,
  uuidGenerator,
  tokenProvider,
  prisma,
} from "../shared/factory/sharedFactory";

import { UserRepositoryPrisma } from "../infra/reporitory/prisma/user/user.repository";

import { AuthUserUseCase } from "../application/use-cases/auth/login/AuthUser.usecase";
import { AuthUserController } from "../presentation/controllers/express/auth/login/AuthUser.controller";

import { CreateUserUseCase } from "../application/use-cases/user/create/CreateUser.usecase";
import { CreateUserController } from "../presentation/controllers/express/user/register/CreateUser.controller";

import { RenameUserUseCase } from "../application/use-cases/user/rename/RenameUser.usecase";
import { RenameUserController } from "../presentation/controllers/express/user/rename/RenameUser.controller";

export function createUserControllers() {
  const userRepository = UserRepositoryPrisma.with(prisma);

  const authUser = AuthUserController.create(
    AuthUserUseCase.create(userRepository, tokenProvider),
    bcrypt,
    jwtToken
  );

  const createUser = CreateUserController.create(
    CreateUserUseCase.create(userRepository, uuidGenerator, bcrypt),
    uuidGenerator,
    bcrypt
  );

  const renameUser = RenameUserController.create(
    RenameUserUseCase.create(userRepository),
    jwtToken
  );

  return [authUser, createUser, renameUser];
}
