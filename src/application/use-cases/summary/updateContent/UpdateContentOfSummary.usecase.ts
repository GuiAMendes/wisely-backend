// Service
import { SummaryGateway } from "../../../../domain/gateway/summary/summary.gateway";

import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import {
  UpdateContentOfSummaryUseCaseInputDTO,
  UpdateContentOfSummaryUseCaseOutputDTO,
} from "../../../../presentation/dtos/summary/updateContent/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class UpdateContentOfSummaryUseCase
  implements
    Usecase<
      UpdateContentOfSummaryUseCaseInputDTO,
      UpdateContentOfSummaryUseCaseOutputDTO
    >
{
  constructor(private readonly summaryGateway: SummaryGateway) {}

  public static create(summaryGateway: SummaryGateway) {
    return new UpdateContentOfSummaryUseCase(summaryGateway);
  }

  async execute({
    idSummary,
    newContent,
  }: UpdateContentOfSummaryUseCaseInputDTO) {
    try {
      const summaryAlreadyExists = await this.summaryGateway.findById(
        idSummary
      );

      if (!summaryAlreadyExists)
        throw new EntityNotFoundError("Summary is not found.");

      const updatedSummary = summaryAlreadyExists.editNote(newContent);

      await this.summaryGateway.updateContent(idSummary, updatedSummary.note);
      const output: UpdateContentOfSummaryUseCaseOutputDTO = {
        idSummary,
        content: updatedSummary.note,
      };

      return output;
    } catch (error) {
      console.error("Error while update content of Summary:", error);
      throw new Error("Failed to update content of Summary.");
    }
  }
}
