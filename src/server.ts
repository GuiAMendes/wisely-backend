import dotenv from "dotenv";
import { Prisma } from "./infra/services/orm/prisma/Prisma";
import { UserRepositoryPrisma } from "./infra/reporitory/prisma/user/user.repository";
import { AuthUserUseCase } from "./application/use-cases/auth/AuthUser.usecase";
import { GenerateTokenProvider } from "./infra/provider/token/GenerateTokenProvider";
import { JwtToken } from "./infra/services/token/JwtToken";
import { AuthUserController } from "./presentation/controllers/express/auth/login/AuthUser.controller";
import { Bcrypt } from "./infra/services/cryptation/Bcrypt";
import { ApiExpress } from "./infra/api/express/api.express";

dotenv.config();

const PORT = Number(process.env.PORT) || 3333;

function runApplication() {
  // ORM
  const prisma = Prisma.getInstance();

  // Token
  const jwtToken = new JwtToken();
  const tokenProvider = new GenerateTokenProvider(jwtToken);

  // Cryptation
  const bcryptService = new Bcrypt();

  const userRepository = UserRepositoryPrisma.with(prisma);
  const authUserUseCAse = AuthUserUseCase.create(userRepository, tokenProvider);
  const authUserController = AuthUserController.create(
    authUserUseCAse,
    bcryptService,
    jwtToken
  );

  const API = ApiExpress.create([authUserController]);
  API.start(PORT);
}

runApplication();
