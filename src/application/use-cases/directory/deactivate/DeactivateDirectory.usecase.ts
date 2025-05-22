// Service
import { DirectoryGateway } from "../../../../domain/gateway/directory/directory.gateway";

import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import {
  DeactivateDirectoryUseCaseInputDTO,
  DeactivateDirectoryUseCaseOutputDTO,
} from "../../../../presentation/dtos/directory/deactivate/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class DeactivateDirectoryUseCase
  implements
    Usecase<
      DeactivateDirectoryUseCaseInputDTO,
      DeactivateDirectoryUseCaseOutputDTO
    >
{
  constructor(private readonly DirectoryGateway: DirectoryGateway) {}

  public static create(DirectoryGateway: DirectoryGateway) {
    return new DeactivateDirectoryUseCase(DirectoryGateway);
  }

  async execute({ idDirectory }: DeactivateDirectoryUseCaseInputDTO) {
    try {
      const directoryAlreadyExists = await this.DirectoryGateway.findById(
        idDirectory
      );

      if (!directoryAlreadyExists)
        throw new EntityNotFoundError("Directory is not found.");

      const completedDirectory = directoryAlreadyExists.deactivate();

      await this.DirectoryGateway.deactivate(idDirectory);
      const output: DeactivateDirectoryUseCaseOutputDTO = {
        idDirectory,
        status: completedDirectory.isActive,
      };

      return output;
    } catch (error) {
      console.error("Error while deactivate Directory:", error);
      throw new Error("Failed to deactivate Directory.");
    }
  }
}
