import { UpdateDateOfAccessJourneyUseCaseOutputDTO } from "../../../../dtos/journey/updateDate/usecaseDTO";

export const presenter = (
  input: UpdateDateOfAccessJourneyUseCaseOutputDTO
): UpdateDateOfAccessJourneyUseCaseOutputDTO => {
  const response = {
    idJourney: input.idJourney,
  };
  return response;
};
