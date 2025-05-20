// Entity
import { User } from "../../../../domain/entity/user/User";

// Interfaces
import { Cryptation } from "../../../../infra/services/cryptation/interfaces/Cryptation.interfaces";
import { UuidGenerator } from "../../../../infra/services/uuid/interfaces/UuidGenerator.interfaces";

// Service
import { Prisma } from "../../../../infra/services/orm/prisma/Prisma";
import type { UserGateway } from "../../../../domain/gateway/user/user.gateway";
import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  CreateUserUseCaseInputDTO,
  CreateUserUseCaseOutputDTO,
} from "../../../../presentation/dtos/user/create/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";

export class CreateUserUseCase
  implements Usecase<CreateUserUseCaseInputDTO, CreateUserUseCaseOutputDTO>
{
  constructor(
    private readonly userGateway: UserGateway,
    private readonly uuidService: UuidGenerator,
    private readonly cryptationService: Cryptation
  ) {}

  public static create(
    userGateway: UserGateway,
    uuidService: UuidGenerator,
    cryptationService: Cryptation
  ) {
    return new CreateUserUseCase(userGateway, uuidService, cryptationService);
  }

  async execute({ username, email, password }: CreateUserUseCaseInputDTO) {
    try {
      const userAlreadyExists = await this.userGateway.findByEmail(email);

      if (userAlreadyExists)
        throw new DatabaseError("Already exists user with credentials.");

      const user = await User.create(
        username,
        email,
        password,
        this.uuidService,
        this.cryptationService
      );

      await this.userGateway.create(user);
      const output: CreateUserUseCaseOutputDTO = { id: user.id };

      return output;
    } catch (error) {
      console.error("Error while creating user:", error);
      throw new Error("Failed to create user.");
    }
  }
}
