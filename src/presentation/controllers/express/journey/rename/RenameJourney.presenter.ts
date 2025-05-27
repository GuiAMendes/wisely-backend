import { RenameJourneyControllerOutputDTO } from "../../../../dtos/journey/rename/controllersDTO";

export const presenter = (
  input: RenameJourneyControllerOutputDTO
): RenameJourneyControllerOutputDTO => {
  const response = {
    idJourney: input.idJourney,
    newJourneyName: input.newJourneyName,
  };
  return response;
};
