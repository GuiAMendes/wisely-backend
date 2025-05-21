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

  //* Routes *//

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

  const API = ApiExpress.create([
    authUserController,
    createUserController,
    renameUserController,
  ]);
  API.start(PORT);
}

runApplication();
