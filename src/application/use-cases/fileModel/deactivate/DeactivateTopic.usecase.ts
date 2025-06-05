// Service
import { FileModelGateway } from "../../../../domain/gateway/fileModel/fileModel.gateway";

import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import {
  DeactivateFileUseCaseInputDTO,
  DeactivateFileUseCaseOutputDTO,
} from "../../../../presentation/dtos/fileModel/deactivate/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class DeactivateFileUseCase
  implements
    Usecase<DeactivateFileUseCaseInputDTO, DeactivateFileUseCaseOutputDTO>
{
  constructor(private readonly FileModelGateway: FileModelGateway) {}

  public static create(FileModelGateway: FileModelGateway) {
    return new DeactivateFileUseCase(FileModelGateway);
  }

  async execute({ idFile }: DeactivateFileUseCaseInputDTO) {
    try {
      const topicAlreadyExists = await this.FileModelGateway.findById(idFile);

      if (!topicAlreadyExists)
        throw new EntityNotFoundError("File is not found.");

      const completedFile = topicAlreadyExists.deactivate();

      await this.FileModelGateway.deactivate(idFile);
      const output: DeactivateFileUseCaseOutputDTO = {
        idFile,
        status: completedFile.isActive,
      };

      return output;
    } catch (error) {
      console.error("Error while deactivate File:", error);
      throw new Error("Failed to deactivate File.");
    }
  }
}
