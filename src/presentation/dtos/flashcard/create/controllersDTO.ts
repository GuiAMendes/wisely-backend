export type CreateFlashcardControllerInputDTO = {
  idTopic: string;
  questionContent: string;
  responseContent: string;
};

export type CreateFlashcardControllerOutputDTO = {
  id: string;
};
