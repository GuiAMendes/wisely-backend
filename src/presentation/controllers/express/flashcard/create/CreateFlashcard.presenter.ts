import { CreateFlashcardControllerOutputDTO } from "../../../../dtos/flashcard/create/controllersDTO";

export const presenter = (
  input: CreateFlashcardControllerOutputDTO
): CreateFlashcardControllerOutputDTO => {
  const response = {
    id: input.id,
  };
  return response;
};
