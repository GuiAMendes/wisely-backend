// Service
import { FlashcardGateway } from "../../../../domain/gateway/flashcard/flashcard.gateway";

import type { Usecase } from "../../interface/usecase.interface";

// DTOS
import {
  UpdateQuestionOfFlashcardUseCaseInputDTO,
  UpdateQuestionOfFlashcardUseCaseOutputDTO,
} from "../../../../presentation/dtos/flashcard/updateQuestion/usecaseDTO";

// Error
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class UpdateQuestionOfFlashcardUseCase
  implements
    Usecase<
      UpdateQuestionOfFlashcardUseCaseInputDTO,
      UpdateQuestionOfFlashcardUseCaseOutputDTO
    >
{
  constructor(private readonly flashcardGateway: FlashcardGateway) {}

  public static create(flashcardGateway: FlashcardGateway) {
    return new UpdateQuestionOfFlashcardUseCase(flashcardGateway);
  }

  async execute({
    idFlashcard,
    newQuestionContent,
  }: UpdateQuestionOfFlashcardUseCaseInputDTO) {
    try {
      const flashcardAlreadyExists = await this.flashcardGateway.findById(
        idFlashcard
      );

      if (!flashcardAlreadyExists)
        throw new EntityNotFoundError("Directory is not found.");

      const updatedQuestion =
        flashcardAlreadyExists.editQuestion(newQuestionContent);

      await this.flashcardGateway.updateQuestion(
        idFlashcard,
        updatedQuestion.questionValue
      );
      const output: UpdateQuestionOfFlashcardUseCaseOutputDTO = {
        idFlashcard,
        newQuestionContent: updatedQuestion.questionValue,
      };

      return output;
    } catch (error) {
      console.error("Error while update question of flashcard:", error);
      throw new Error("Failed to update question of flashcard.");
    }
  }
}
