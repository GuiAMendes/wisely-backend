// Interfaces
import { GenerateTokenProvider } from "../../../infra/provider/token/GenerateTokenProvider";
import { Cryptation } from "../../../infra/services/cryptation/interfaces/Cryptation.interfaces";
import { Prisma } from "../../../infra/services/orm/prisma/Prisma";
import { TokenProvider } from "../../../infra/services/token/interfaces/token.interfaces";
import { UnauthorizedError } from "../../../presentation/errors/UnauthorizedError"; // importe corretamente

interface AuthRequest {
  email: string;
  password: string;
  cryptation: Cryptation;
  tokenGenerator: TokenProvider;
}

export class AuthUserUseCase {
  async execute({ password, email, cryptation, tokenGenerator }: AuthRequest) {
    const userAlreadyExist = await Prisma.getInstance().user.findFirst({
      where: {
        email,
      },
    });

    if (!userAlreadyExist)
      throw new UnauthorizedError("User or password incorrect");

    const passwordMatch = await cryptation.compare(
      password,
      userAlreadyExist.user_password
    );

    if (!passwordMatch)
      throw new UnauthorizedError("User or password incorrect");

    const generateToken = new GenerateTokenProvider(tokenGenerator);

    const token = generateToken.execute({ userId: userAlreadyExist.id });

    return { token };
  }
}
