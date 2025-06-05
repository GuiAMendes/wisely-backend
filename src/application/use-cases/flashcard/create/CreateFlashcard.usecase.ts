// Entity
import { Flashcard } from "../../../../domain/entity/flashcard/Flashcard";

// Interfaces
import type { UuidGenerator } from "../../../../infra/services/uuid/interfaces/UuidGenerator.interfaces";

// UseCase
import type { Usecase } from "../../interface/usecase.interface";

// Gateway
import type { FlashcardGateway } from "../../../../domain/gateway/flashcard/flashcard.gateway";

// DTOS
import type {
  CreateFlashcardUseCaseInputDTO,
  CreateFlashcardUseCaseOutputDTO,
} from "../../../../presentation/dtos/flashcard/create/usecaseDTO";

// Error
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";

export class CreateFlashcardUseCase
  implements
    Usecase<CreateFlashcardUseCaseInputDTO, CreateFlashcardUseCaseOutputDTO>
{
  constructor(
    private readonly flashcardGateway: FlashcardGateway,
    private readonly uuidService: UuidGenerator
  ) {}

  public static create(
    flashcardGateway: FlashcardGateway,
    uuidService: UuidGenerator
  ) {
    return new CreateFlashcardUseCase(flashcardGateway, uuidService);
  }

  async execute({
    idTopic,
    questionContent,
    responseContent,
  }: CreateFlashcardUseCaseInputDTO) {
    try {
      const flashcard = Flashcard.create({
        idTopic,
        questionContent,
        responseContent,
        uuidGenerator: this.uuidService,
      });

      await this.flashcardGateway.create(flashcard);
      const output: CreateFlashcardUseCaseOutputDTO = {
        id: flashcard.id,
      };

      return output;
    } catch (error) {
      console.error("Error while creating flashcard:", error);
      throw new DatabaseError("Failed to create flashcard.");
    }
  }
}
