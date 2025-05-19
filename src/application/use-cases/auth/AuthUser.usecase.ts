// Interfaces
import { UserGateway } from "../../../domain/gateway/user/user.gateway";
import { GenerateTokenProvider } from "../../../infra/provider/token/GenerateTokenProvider";
import { UnauthorizedError } from "../../../presentation/errors/UnauthorizedError";
import { Usecase } from "../interface/usecase.interface";

// DTOS
import {
  AuthUserUseCaseInputDTO,
  AuthUserUsecaseOutputDTO,
} from "../../../presentation/dtos/auth/usecaseDTO";

export class AuthUserUseCase
  implements Usecase<AuthUserUseCaseInputDTO, AuthUserUsecaseOutputDTO>
{
  constructor(
    private readonly userGateway: UserGateway,
    private readonly tokenGenerator: GenerateTokenProvider
  ) {}

  public static create(
    userGateway: UserGateway,
    tokenGenerator: GenerateTokenProvider
  ) {
    return new AuthUserUseCase(userGateway, tokenGenerator);
  }

  async execute({
    password,
    email,
    cryptation,
  }: AuthUserUseCaseInputDTO): Promise<AuthUserUsecaseOutputDTO> {
    const userAlreadyExist = await this.userGateway.findByEmail(email);

    if (!userAlreadyExist)
      throw new UnauthorizedError("User or password incorrect");

    const passwordMatch = await cryptation.compare(
      password,
      userAlreadyExist.passwordHash
    );

    if (!passwordMatch)
      throw new UnauthorizedError("User or password incorrect");
    const output = await this.tokenGenerator.execute({
      userId: userAlreadyExist.id,
    });

    return { token: output };
  }
}
