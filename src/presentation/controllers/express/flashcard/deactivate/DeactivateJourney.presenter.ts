import { DeactivateFlashcardUseCaseOutputDTO } from "../../../../dtos/flashcard/deactivate/usecaseDTO";

export const presenter = (
  input: DeactivateFlashcardUseCaseOutputDTO
): DeactivateFlashcardUseCaseOutputDTO => {
  const response = {
    idFlashcard: input.idFlashcard,
    status: input.status,
  };
  return response;
};
