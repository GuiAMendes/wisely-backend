// Service
import type { ProgressGateway } from "../../../../domain/gateway/progress/progress.gateway";
import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  CreateProgressUseCaseInputDTO,
  CreateProgressUseCaseOutputDTO,
} from "../../../../presentation/dtos/progress/create/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";

export class CreateProgressUseCase
  implements
    Usecase<CreateProgressUseCaseInputDTO, CreateProgressUseCaseOutputDTO>
{
  constructor(private readonly ProgressGateway: ProgressGateway) {}

  public static create(ProgressGateway: ProgressGateway) {
    return new CreateProgressUseCase(ProgressGateway);
  }

  async execute({ idJourney }: CreateProgressUseCaseInputDTO) {
    try {
      await this.ProgressGateway.create(idJourney);
      const output: CreateProgressUseCaseOutputDTO = { idJourney: idJourney };
      return output;
    } catch (error) {
      console.error("Error while creating progress from a journey:", error);
      throw new DatabaseError("Failed to create progress from a journey.");
    }
  }
}
