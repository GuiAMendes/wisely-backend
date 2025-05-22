// Service
import { DirectoryGateway } from "../../../../domain/gateway/directory/directory.gateway";

import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import {
  CompleteDirectoryUseCaseInputDTO,
  CompleteDirectoryUseCaseOutputDTO,
} from "../../../../presentation/dtos/directory/complete/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class CompleteDirectoryUseCase
  implements
    Usecase<
      CompleteDirectoryUseCaseInputDTO,
      CompleteDirectoryUseCaseOutputDTO
    >
{
  constructor(private readonly DirectoryGateway: DirectoryGateway) {}

  public static create(DirectoryGateway: DirectoryGateway) {
    return new CompleteDirectoryUseCase(DirectoryGateway);
  }

  async execute({ idDirectory }: CompleteDirectoryUseCaseInputDTO) {
    try {
      const directoryAlreadyExists = await this.DirectoryGateway.findById(
        idDirectory
      );

      if (!directoryAlreadyExists)
        throw new EntityNotFoundError("Directory is not found.");

      const completedDirectory = directoryAlreadyExists.complete();

      await this.DirectoryGateway.complete(idDirectory);
      const output: CompleteDirectoryUseCaseOutputDTO = {
        idDirectory,
        status: completedDirectory.isCompleted,
      };

      return output;
    } catch (error) {
      console.error(
        "Error while marking is complete status in Directory:",
        error
      );
      throw new Error("Failed to marking is complete status in Directory.");
    }
  }
}
