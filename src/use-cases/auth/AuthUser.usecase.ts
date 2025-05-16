// Interfaces
import { Prisma } from "../../infra/services/orm/prisma/Prisma";
import { Cryptation } from "../../infra/services/cryptation/interfaces/Cryptation.interfaces";
import { GenerateTokenProvider } from "../../provider/token/GenerateTokenProvider";
import { TokenProvider } from "../../infra/services/token/interfaces/token.interfaces";

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

    if (!userAlreadyExist) throw new Error("User or password incorrect");

    const passwordMatch = await cryptation.compare(
      password,
      userAlreadyExist.user_password
    );

    if (!passwordMatch) throw new Error("User or password incorrect");

    const generateToken = new GenerateTokenProvider(tokenGenerator);

    const token = generateToken.execute({ userId: userAlreadyExist.id });

    return { token: token };
  }
}
