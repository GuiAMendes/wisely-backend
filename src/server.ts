import dotenv from "dotenv";
import { Prisma } from "./infra/services/orm/prisma/Prisma";
import { UserRepositoryPrisma } from "./infra/reporitory/prisma/user/user.repository";
import { AuthUserUseCase } from "./application/use-cases/auth/login/AuthUser.usecase";
import { GenerateTokenProvider } from "./infra/provider/token/GenerateTokenProvider";
import { JwtToken } from "./infra/services/token/JwtToken";
import { AuthUserController } from "./presentation/controllers/express/auth/login/AuthUser.controller";
import { Bcrypt } from "./infra/services/cryptation/Bcrypt";
import { ApiExpress } from "./infra/api/express/api.express";
import { CreateUserUseCase } from "./application/use-cases/user/create/CreateUser.usecase";
import { CryptoUuidGenerator } from "./infra/services/uuid/CryptoUuidGenerator";
import { CreateUserController } from "./presentation/controllers/express/user/register/CreateUser.controller";
import { RenameUserUseCase } from "./application/use-cases/user/rename/RenameUser.usecase";
import { RenameUserController } from "./presentation/controllers/express/user/rename/RenameUser.controller";
import { DirectoryRepositoryPrisma } from "./infra/reporitory/prisma/directory/directory.repository";
import { CreateDirectoryUseCase } from "./application/use-cases/directory/create/CreateDirectory.usecase";
import { CreateDirectoryController } from "./presentation/controllers/express/directory/create/CreateDirectory.controller";
import { ListAllDirectoriesUseCase } from "./application/use-cases/directory/listAll/ListAllDirectories.usecase";
import { ListAllDirectoriesController } from "./presentation/controllers/express/directory/listAll/ListAllDirectories.controller";
import { ListDirectoriesAccessedRecentlyUseCase } from "./application/use-cases/directory/listRecents/ListAllDirectories.usecase";
import { ListDirectoriesAccessedRecentlyController } from "./presentation/controllers/express/directory/listRecents/ListDirectoriesAccessedRecently.controller";

dotenv.config();

const PORT = Number(process.env.PORT) || 3333;

function runApplication() {
  // Token
  const jwtToken = new JwtToken();
  const tokenProvider = new GenerateTokenProvider(jwtToken);

  // Cryptation
  const bcryptService = new Bcrypt();

  // UUID
  const cryptoUUID = new CryptoUuidGenerator();

  // ORM
  const prisma = Prisma.getInstance();

  // Repository
  const userRepository = UserRepositoryPrisma.with(prisma);
  const directoryRepository = DirectoryRepositoryPrisma.with(prisma);

  //* Routes *//

  // # User

  //Login
  const authUserUseCase = AuthUserUseCase.create(userRepository, tokenProvider);
  const authUserController = AuthUserController.create(
    authUserUseCase,
    bcryptService,
    jwtToken
  );

  // Register
  const createUserUseCase = CreateUserUseCase.create(
    userRepository,
    cryptoUUID,
    bcryptService
  );
  const createUserController = CreateUserController.create(
    createUserUseCase,
    cryptoUUID,
    bcryptService
  );

  // Raname user
  const renameUserUseCase = RenameUserUseCase.create(userRepository);
  const renameUserController = RenameUserController.create(renameUserUseCase);

  // # Directory

  // Create
  const createDirectoryUseCase = CreateDirectoryUseCase.create(
    directoryRepository,
    cryptoUUID
  );
  const createDirecotryController = CreateDirectoryController.create(
    createDirectoryUseCase,
    jwtToken
  );

  // ListAll
  const listAllDirectoriesUseCase =
    ListAllDirectoriesUseCase.create(directoryRepository);
  const listAllDirectoriesController = ListAllDirectoriesController.create(
    listAllDirectoriesUseCase,
    jwtToken
  );

  // ListRecentaccess
  const listDirectoriesAccessedRecentlyUseCase =
    ListDirectoriesAccessedRecentlyUseCase.create(directoryRepository);
  const listDirectoriesAccessedRecentlyController =
    ListDirectoriesAccessedRecentlyController.create(
      listDirectoriesAccessedRecentlyUseCase,
      jwtToken
    );

  const API = ApiExpress.create([
    authUserController,
    createUserController,
    renameUserController,
    createDirecotryController,
    listAllDirectoriesController,
    listDirectoriesAccessedRecentlyController,
  ]);
  API.start(PORT);
}

runApplication();
