// Service
import { FlashcardGateway } from "../../../../domain/gateway/flashcard/flashcard.gateway";

// Interface
import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import {
  DeactivateFlashcardUseCaseInputDTO,
  DeactivateFlashcardUseCaseOutputDTO,
} from "../../../../presentation/dtos/flashcard/deactivate/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class DeactivateFlashcardUseCase
  implements
    Usecase<
      DeactivateFlashcardUseCaseInputDTO,
      DeactivateFlashcardUseCaseOutputDTO
    >
{
  constructor(private readonly flashcardGateway: FlashcardGateway) {}

  public static create(flashcardGateway: FlashcardGateway) {
    return new DeactivateFlashcardUseCase(flashcardGateway);
  }

  async execute({ idFlashcard }: DeactivateFlashcardUseCaseInputDTO) {
    try {
      const flashcardAlreadyExists = await this.flashcardGateway.findById(
        idFlashcard
      );

      if (!flashcardAlreadyExists)
        throw new EntityNotFoundError("flashcard is not found.");

      const completedflashcard = flashcardAlreadyExists.deactivate();

      await this.flashcardGateway.deactivate(idFlashcard);
      const output: DeactivateFlashcardUseCaseOutputDTO = {
        idFlashcard,
        status: completedflashcard.isActive,
      };

      return output;
    } catch (error) {
      console.error("Error while deactivate flashcard:", error);
      throw new Error("Failed to deactivate flashcard.");
    }
  }
}
