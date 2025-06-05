import { ListAllFlashcardsControllerOutputDTO } from "../../../../dtos/flashcard/listAll/controllersDTO";

export const presenter = (
  input: ListAllFlashcardsControllerOutputDTO
): ListAllFlashcardsControllerOutputDTO => {
  const response = {
    flashcards: input.flashcards,
  };
  return response;
};
