import { DeactivateJourneyUseCaseOutputDTO } from "../../../../dtos/journey/deactivate/usecaseDTO";

export const presenter = (
  input: DeactivateJourneyUseCaseOutputDTO
): DeactivateJourneyUseCaseOutputDTO => {
  const response = {
    idJourney: input.idJourney,
    status: input.status,
  };
  return response;
};
