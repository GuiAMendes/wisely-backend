// Entity
import { Summary } from "../../../../domain/entity/summary/Summary";

// Interfaces
import { UuidGenerator } from "../../../../infra/services/uuid/interfaces/UuidGenerator.interfaces";

// Service
import type { Usecase } from "../../interface/usecase.interface";

// Gateway
import { SummaryGateway } from "../../../../domain/gateway/summary/summary.gateway";

// DTOS
import type {
  CreateSummaryUseCaseInputDTO,
  CreateSummaryUseCaseOutputDTO,
} from "../../../../presentation/dtos/summary/create/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";

export class CreateSummaryUseCase
  implements
    Usecase<CreateSummaryUseCaseInputDTO, CreateSummaryUseCaseOutputDTO>
{
  constructor(
    private readonly SummaryGateway: SummaryGateway,
    private readonly uuidService: UuidGenerator
  ) {}

  public static create(
    SummaryGateway: SummaryGateway,
    uuidService: UuidGenerator
  ) {
    return new CreateSummaryUseCase(SummaryGateway, uuidService);
  }

  async execute({ idTopic, title, noteContent }: CreateSummaryUseCaseInputDTO) {
    try {
      const summary = Summary.create({
        idTopic,
        title,
        noteContent,
        uuidGenerator: this.uuidService,
      });

      await this.SummaryGateway.create(summary);
      const output: CreateSummaryUseCaseOutputDTO = {
        id: summary.id,
      };

      return output;
    } catch (error) {
      console.error("Error while creating summary:", error);
      throw new DatabaseError("Failed to create summary.");
    }
  }
}
