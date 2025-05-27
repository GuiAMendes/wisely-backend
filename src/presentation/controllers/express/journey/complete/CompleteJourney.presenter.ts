import { CompleteJourneyUseCaseOutputDTO } from "../../../../dtos/journey/complete/usecaseDTO";

export const presenter = (
  input: CompleteJourneyUseCaseOutputDTO
): CompleteJourneyUseCaseOutputDTO => {
  const response = {
    idJourney: input.idJourney,
    status: input.status,
  };
  return response;
};
