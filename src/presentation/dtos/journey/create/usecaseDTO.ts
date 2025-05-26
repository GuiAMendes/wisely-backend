export type CreateJourneyUseCaseInputDTO = {
  name: string;
  idDirectory: string;
  typeOfJourney: string;
};

export type CreateJourneyUseCaseOutputDTO = {
  id: string;
  name: string;
  typeOfJourney: string;
};
