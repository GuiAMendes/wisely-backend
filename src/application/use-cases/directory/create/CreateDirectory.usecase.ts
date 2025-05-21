// Entity
import { Directory } from "../../../../domain/entity/directory/Directory";

// Interfaces
import { UuidGenerator } from "../../../../infra/services/uuid/interfaces/UuidGenerator.interfaces";

import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  CreateDirectoryUseCaseInputDTO,
  CreateDirectoryUseCaseOutputDTO,
} from "../../../../presentation/dtos/directory/create/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { DirectoryGateway } from "../../../../domain/gateway/directory/directory.gateway";

export class CreateDirectoryUseCase
  implements
    Usecase<CreateDirectoryUseCaseInputDTO, CreateDirectoryUseCaseOutputDTO>
{
  constructor(
    private readonly directoryGateway: DirectoryGateway,
    private readonly uuidService: UuidGenerator
  ) {}

  public static create(
    directoryGateway: DirectoryGateway,
    uuidService: UuidGenerator
  ) {
    return new CreateDirectoryUseCase(directoryGateway, uuidService);
  }

  async execute({ name, idUser, isTemplate }: CreateDirectoryUseCaseInputDTO) {
    try {
      const directory = Directory.create({
        idUser,
        directoryName: name,
        isTemplate: isTemplate || false,
        uuidGenerator: this.uuidService,
      });

      await this.directoryGateway.create(directory);
      const output: CreateDirectoryUseCaseOutputDTO = {
        id: directory.id,
        name: directory.directoryName,
      };

      return output;
    } catch (error) {
      console.error("Error while creating directory:", error);
      throw new DatabaseError("Failed to create directory.");
    }
  }
}
