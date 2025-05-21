import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  ListDirectoriesAccessedRecentlyUseCaseInputDTO,
  ListDirectoriesAccessedRecentlyUseCaseOutputDTO,
} from "../../../../presentation/dtos/directory/listRecents/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { DirectoryGateway } from "../../../../domain/gateway/directory/directory.gateway";

export class ListDirectoriesAccessedRecentlyUseCase
  implements
    Usecase<
      ListDirectoriesAccessedRecentlyUseCaseInputDTO,
      ListDirectoriesAccessedRecentlyUseCaseOutputDTO
    >
{
  constructor(private readonly directoryGateway: DirectoryGateway) {}

  public static create(directoryGateway: DirectoryGateway) {
    return new ListDirectoriesAccessedRecentlyUseCase(directoryGateway);
  }

  async execute({ idUser }: ListDirectoriesAccessedRecentlyUseCaseInputDTO) {
    try {
      const directories = await this.directoryGateway.listRecentAccess(idUser);
      const output: ListDirectoriesAccessedRecentlyUseCaseOutputDTO = {
        directories,
      };

      return output;
    } catch (error) {
      console.error("Error while restore directories:", error);
      throw new DatabaseError("Failed to restore directories.");
    }
  }
}
