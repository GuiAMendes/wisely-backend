// Service
import { DirectoryGateway } from "../../../../domain/gateway/directory/directory.gateway";

import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import {
  UpdateDateOfAccessDirectoryUseCaseInputDTO,
  UpdateDateOfAccessDirectoryUseCaseOutputDTO,
} from "../../../../presentation/dtos/directory/updateDate/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class UpdateDateOfAccessDirectoryUseCase
  implements
    Usecase<
      UpdateDateOfAccessDirectoryUseCaseInputDTO,
      UpdateDateOfAccessDirectoryUseCaseOutputDTO
    >
{
  constructor(private readonly DirectoryGateway: DirectoryGateway) {}

  public static create(DirectoryGateway: DirectoryGateway) {
    return new UpdateDateOfAccessDirectoryUseCase(DirectoryGateway);
  }

  async execute({ idDirectory }: UpdateDateOfAccessDirectoryUseCaseInputDTO) {
    try {
      const DirectoryAlreadyExists = await this.DirectoryGateway.findById(
        idDirectory
      );

      if (!DirectoryAlreadyExists)
        throw new EntityNotFoundError("Directory is not found.");

      await this.DirectoryGateway.updateDateOfAccess(idDirectory);
      const output: UpdateDateOfAccessDirectoryUseCaseOutputDTO = {
        idDirectory,
      };

      return output;
    } catch (error) {
      console.error("Error while update date of access in Directory:", error);
      throw new Error("Failed to update date of access in Directory.");
    }
  }
}
