// Service
import type { UserGateway } from "../../../../domain/gateway/user/user.gateway";
import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  RenameUserUseCaseInputDTO,
  RenameUserUseCaseOutputDTO,
} from "../../../../presentation/dtos/user/rename/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class RenameUserUseCase
  implements Usecase<RenameUserUseCaseInputDTO, RenameUserUseCaseOutputDTO>
{
  constructor(private readonly userGateway: UserGateway) {}

  public static create(userGateway: UserGateway) {
    return new RenameUserUseCase(userGateway);
  }

  async execute({ idUser, newUsername }: RenameUserUseCaseInputDTO) {
    try {
      const userAlreadyExists = await this.userGateway.findById(idUser);

      if (!userAlreadyExists)
        throw new EntityNotFoundError("User is not found.");

      const renamedUser = userAlreadyExists.changeUsername(newUsername);

      await this.userGateway.updateName(idUser, renamedUser.username);
      const output: RenameUserUseCaseOutputDTO = {
        idUser,
        username: renamedUser.username,
      };

      return output;
    } catch (error) {
      console.error("Error while rename username:", error);
      throw new Error("Failed to rename username.");
    }
  }
}
