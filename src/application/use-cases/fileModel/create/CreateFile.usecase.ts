// Entity
import { FileModel } from "../../../../domain/entity/fileModel/FileModel";

// Interfaces
import type { UuidGenerator } from "../../../../infra/services/uuid/interfaces/UuidGenerator.interfaces";

// UseCase
import type { Usecase } from "../../interface/usecase.interface";

// Gateway
import type { FileModelGateway } from "../../../../domain/gateway/fileModel/fileModel.gateway";

// DTOS
import type {
  CreateFileUseCaseInputDTO,
  CreateFileUseCaseOutputDTO,
} from "../../../../presentation/dtos/fileModel/create/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";

export class CreateFileUseCase
  implements Usecase<CreateFileUseCaseInputDTO, CreateFileUseCaseOutputDTO>
{
  constructor(
    private readonly fileModelGateway: FileModelGateway,
    private readonly uuidService: UuidGenerator
  ) {}

  public static create(
    fileModelGateway: FileModelGateway,
    uuidService: UuidGenerator
  ) {
    return new CreateFileUseCase(fileModelGateway, uuidService);
  }

  async execute({
    idTopic,
    fileName,
    fileType,
    fileContent,
  }: CreateFileUseCaseInputDTO) {
    try {
      const fileModel = FileModel.create({
        topicId: idTopic,
        fileName,
        fileType,
        base64FileContent: fileContent,
        uuidGenerator: this.uuidService,
      });

      await this.fileModelGateway.create(fileModel);
      const output: CreateFileUseCaseOutputDTO = {
        id: fileModel.id,
        fileName: fileModel.fileName,
        fileType: fileModel.fileType,
        fileContent: fileModel.base64Content,
      };

      return output;
    } catch (error) {
      console.error("Error while creating file:", error);
      throw new DatabaseError("Failed to create file.");
    }
  }
}
