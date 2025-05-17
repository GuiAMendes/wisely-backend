// Entity
import { User } from "../../../domain/user";

// Interfaces
import { Cryptation } from "../../../infra/services/cryptation/interfaces/Cryptation.interfaces";
import { UuidGenerator } from "../../../infra/services/uuid/interfaces/UuidGenerator.interfaces";

// Service
import { Prisma } from "../../../infra/services/orm/prisma/Prisma";

// DTO
interface CreateUserUseCaseRequest {
  username: string;
  email: string;
  password: string;
}

export class CreateUserUseCase {
  constructor(
    private readonly uuidGenerator: UuidGenerator,
    private readonly cryptation: Cryptation
  ) {}

  async execute({ username, email, password }: CreateUserUseCaseRequest) {
    const userAlreadyExists = await Prisma.getInstance().user.findFirst({
      where: { email },
    });

    if (userAlreadyExists)
      throw new Error("Já existe um usuário com essas credenciais.");

    const user = await User.create(
      username,
      email,
      password,
      this.uuidGenerator,
      this.cryptation
    );

    const createdUser = await Prisma.getInstance().user.create({
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        user_password: user.passwordHash,
      },
    });

    return createdUser;
  }
}
