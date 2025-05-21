// Service
import { DirectoryGateway } from "../../../../domain/gateway/directory/directory.gateway";

import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import {
  RenameDirectoryUseCaseInputDTO,
  RenameDirectoryUseCaseOutputDTO,
} from "../../../../presentation/dtos/directory/rename/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class RenameDirectoryUseCase
  implements
    Usecase<RenameDirectoryUseCaseInputDTO, RenameDirectoryUseCaseOutputDTO>
{
  constructor(private readonly DirectoryGateway: DirectoryGateway) {}

  public static create(DirectoryGateway: DirectoryGateway) {
    return new RenameDirectoryUseCase(DirectoryGateway);
  }

  async execute({
    idDirectory,
    newDirectoryName,
  }: RenameDirectoryUseCaseInputDTO) {
    try {
      const DirectoryAlreadyExists = await this.DirectoryGateway.findById(
        idDirectory
      );

      if (!DirectoryAlreadyExists)
        throw new EntityNotFoundError("Directory is not found.");

      const renamedDirectory = DirectoryAlreadyExists.rename(newDirectoryName);

      await this.DirectoryGateway.updateName(
        idDirectory,
        renamedDirectory.directoryName
      );
      const output: RenameDirectoryUseCaseOutputDTO = {
        idDirectory,
        directoryName: renamedDirectory.directoryName,
      };

      return output;
    } catch (error) {
      console.error("Error while rename Directory:", error);
      throw new Error("Failed to rename Directory.");
    }
  }
}
