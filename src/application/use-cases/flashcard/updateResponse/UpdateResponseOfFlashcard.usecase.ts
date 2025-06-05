// Service
import { FlashcardGateway } from "../../../../domain/gateway/flashcard/flashcard.gateway";

import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import {
  UpdateResponseOfFlashcardUseCaseInputDTO,
  UpdateResponseOfFlashcardUseCaseOutputDTO,
} from "../../../../presentation/dtos/flashcard/updateResponse/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class UpdateResponseOfFlashcardUseCase
  implements
    Usecase<
      UpdateResponseOfFlashcardUseCaseInputDTO,
      UpdateResponseOfFlashcardUseCaseOutputDTO
    >
{
  constructor(private readonly flashcardGateway: FlashcardGateway) {}

  public static create(flashcardGateway: FlashcardGateway) {
    return new UpdateResponseOfFlashcardUseCase(flashcardGateway);
  }

  async execute({
    idFlashcard,
    newResponseContent,
  }: UpdateResponseOfFlashcardUseCaseInputDTO) {
    try {
      const flashcardAlreadyExists = await this.flashcardGateway.findById(
        idFlashcard
      );

      if (!flashcardAlreadyExists)
        throw new EntityNotFoundError("flashcard is not found.");

      const updatedQuestion =
        flashcardAlreadyExists.editResponse(newResponseContent);

      await this.flashcardGateway.updateResponse(
        idFlashcard,
        updatedQuestion.responseValue
      );
      const output: UpdateResponseOfFlashcardUseCaseOutputDTO = {
        idFlashcard,
        newResponseContent: updatedQuestion.responseValue,
      };

      return output;
    } catch (error) {
      console.error("Error while update response of flashcard:", error);
      throw new Error("Failed to update response of flashcard.");
    }
  }
}
