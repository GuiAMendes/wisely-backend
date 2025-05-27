import { CreateJourneyControllerOutputDTO } from "../../../../dtos/journey/create/controllersDTO";

export const presenter = (
  input: CreateJourneyControllerOutputDTO
): CreateJourneyControllerOutputDTO => {
  const response = {
    id: input.id,
    name: input.name,
    typeOfJourney: input.typeOfJourney,
  };
  return response;
};
