import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  FindByNameDirectoriesUseCaseInputDTO,
  FindByNameDirectoriesUseCaseOutputDTO,
} from "../../../../presentation/dtos/directory/findByName/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { DirectoryGateway } from "../../../../domain/gateway/directory/directory.gateway";

export class FindByNameDirectoriesUseCase
  implements
    Usecase<
      FindByNameDirectoriesUseCaseInputDTO,
      FindByNameDirectoriesUseCaseOutputDTO
    >
{
  constructor(private readonly directoryGateway: DirectoryGateway) {}

  public static create(directoryGateway: DirectoryGateway) {
    return new FindByNameDirectoriesUseCase(directoryGateway);
  }

  async execute({
    idUser,
    directoryName,
  }: FindByNameDirectoriesUseCaseInputDTO) {
    try {
      const directories = await this.directoryGateway.findByName(
        idUser,
        directoryName
      );
      const output: FindByNameDirectoriesUseCaseOutputDTO = {
        directories,
      };

      return output;
    } catch (error) {
      console.error("Error while restore directories by name:", error);
      throw new DatabaseError("Failed to restore directories by name.");
    }
  }
}
