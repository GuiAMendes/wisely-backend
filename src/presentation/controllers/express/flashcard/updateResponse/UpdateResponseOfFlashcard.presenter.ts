import { UpdateResponseOfFlashcardControllerOutputDTO } from "../../../../dtos/flashcard/updateResponse/controllersDTO";

export const presenter = (
  input: UpdateResponseOfFlashcardControllerOutputDTO
): UpdateResponseOfFlashcardControllerOutputDTO => {
  const response = {
    idFlashcard: input.idFlashcard,
    newResponseContent: input.newResponseContent,
  };
  return response;
};
