// Service
import { FlashcardGateway } from "../../../../domain/gateway/flashcard/flashcard.gateway";

// Interface
import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import type {
  ListAllFlashcardsUseCaseInputDTO,
  ListAllFlashcardsUseCaseOutputDTO,
} from "../../../../presentation/dtos/flashcard/listAll/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";

export class ListAllFlashcardsUseCase
  implements
    Usecase<
      ListAllFlashcardsUseCaseInputDTO,
      ListAllFlashcardsUseCaseOutputDTO
    >
{
  constructor(private readonly flashcardGateway: FlashcardGateway) {}

  public static create(flashcardGateway: FlashcardGateway) {
    return new ListAllFlashcardsUseCase(flashcardGateway);
  }

  async execute({ idTopic }: ListAllFlashcardsUseCaseInputDTO) {
    try {
      const flashcards = await this.flashcardGateway.listAll(idTopic);
      const output: ListAllFlashcardsUseCaseOutputDTO = {
        flashcards,
      };

      return output;
    } catch (error) {
      console.error("Error while restore flashcards:", error);
      throw new DatabaseError("Failed to restore flashcards.");
    }
  }
}
