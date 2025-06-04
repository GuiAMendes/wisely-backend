export type IncreaseProgressUseCaseInputDTO = {
  idJourney: string;
};

export type IncreaseProgressUseCaseOutputDTO = {
  idJourney: string;
  completedTopics: number;
  totalTopics: number;
};
