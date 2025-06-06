export type UpdateQuestionOfFlashcardControllerInputDTO = {
  idFlashcard: string;
  questionContent: string;
};

export type UpdateQuestionOfFlashcardControllerOutputDTO = {
  idFlashcard: string;
  newQuestionContent: string;
};
