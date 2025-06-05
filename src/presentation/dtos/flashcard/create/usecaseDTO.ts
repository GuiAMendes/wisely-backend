export type CreateFlashcardUseCaseInputDTO = {
  idTopic: string;
  questionContent: string;
  responseContent: string;
};

export type CreateFlashcardUseCaseOutputDTO = {
  id: string;
};
