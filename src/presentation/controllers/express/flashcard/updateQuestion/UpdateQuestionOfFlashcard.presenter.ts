import { UpdateQuestionOfFlashcardControllerOutputDTO } from "../../../../dtos/flashcard/updateQuestion/controllersDTO";

export const presenter = (
  input: UpdateQuestionOfFlashcardControllerOutputDTO
): UpdateQuestionOfFlashcardControllerOutputDTO => {
  const response = {
    idFlashcard: input.idFlashcard,
    newQuestionContent: input.newQuestionContent,
  };
  return response;
};
