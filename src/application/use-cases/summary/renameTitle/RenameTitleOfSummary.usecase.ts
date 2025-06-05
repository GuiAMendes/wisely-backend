// Service
import { SummaryGateway } from "../../../../domain/gateway/summary/summary.gateway";

import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import {
  RenameTitleOfSummaryUseCaseInputDTO,
  RenameTitleOfSummaryUseCaseOutputDTO,
} from "../../../../presentation/dtos/summary/renameTitle/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class RenameTitleOfSummaryUseCase
  implements
    Usecase<
      RenameTitleOfSummaryUseCaseInputDTO,
      RenameTitleOfSummaryUseCaseOutputDTO
    >
{
  constructor(private readonly summaryGateway: SummaryGateway) {}

  public static create(summaryGateway: SummaryGateway) {
    return new RenameTitleOfSummaryUseCase(summaryGateway);
  }

  async execute({ idSummary, newTitle }: RenameTitleOfSummaryUseCaseInputDTO) {
    try {
      const summaryAlreadyExists = await this.summaryGateway.findById(
        idSummary
      );

      if (!summaryAlreadyExists)
        throw new EntityNotFoundError("Summary is not found.");

      const renamedSummary = summaryAlreadyExists.editTitle(newTitle);

      await this.summaryGateway.updateTitle(idSummary, renamedSummary.title);
      const output: RenameTitleOfSummaryUseCaseOutputDTO = {
        idSummary,
        title: renamedSummary.title,
      };

      return output;
    } catch (error) {
      console.error("Error while rename title of Summary:", error);
      throw new Error("Failed to rename title of Summary.");
    }
  }
}
