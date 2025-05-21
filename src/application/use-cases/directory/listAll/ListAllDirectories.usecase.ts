import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  ListAllDirectoriesUseCaseInputDTO,
  ListAllDirectoriesUseCaseOutputDTO,
} from "../../../../presentation/dtos/directory/listAll/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { DirectoryGateway } from "../../../../domain/gateway/directory/directory.gateway";

export class ListAllDirectoriesUseCase
  implements
    Usecase<
      ListAllDirectoriesUseCaseInputDTO,
      ListAllDirectoriesUseCaseOutputDTO
    >
{
  constructor(
    private readonly directoryGateway: DirectoryGateway // private readonly uuidService: UuidGenerator
  ) {}

  public static create(directoryGateway: DirectoryGateway) {
    return new ListAllDirectoriesUseCase(directoryGateway);
  }

  async execute({ idUser }: ListAllDirectoriesUseCaseInputDTO) {
    try {
      const directories = await this.directoryGateway.listAll(idUser);
      const output: ListAllDirectoriesUseCaseOutputDTO = {
        directories,
      };

      return output;
    } catch (error) {
      console.error("Error while restore directories:", error);
      throw new DatabaseError("Failed to restore directories.");
    }
  }
}
