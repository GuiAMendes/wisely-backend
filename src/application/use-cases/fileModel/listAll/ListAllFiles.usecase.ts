// Service
import { FileModelGateway } from "../../../../domain/gateway/fileModel/fileModel.gateway";

// Interface
import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  ListAllFilesUseCaseInputDTO,
  ListAllFilesUseCaseOutputDTO,
} from "../../../../presentation/dtos/fileModel/listAll/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";

export class ListAllFilesUseCase
  implements Usecase<ListAllFilesUseCaseInputDTO, ListAllFilesUseCaseOutputDTO>
{
  constructor(private readonly FileModelGateway: FileModelGateway) {}

  public static create(FileModelGateway: FileModelGateway) {
    return new ListAllFilesUseCase(FileModelGateway);
  }

  async execute({ idTopic }: ListAllFilesUseCaseInputDTO) {
    try {
      const files = await this.FileModelGateway.listAll(idTopic);
      const output: ListAllFilesUseCaseOutputDTO = {
        files,
      };

      return output;
    } catch (error) {
      console.error("Error while restore files:", error);
      throw new DatabaseError("Failed to restore files.");
    }
  }
}
