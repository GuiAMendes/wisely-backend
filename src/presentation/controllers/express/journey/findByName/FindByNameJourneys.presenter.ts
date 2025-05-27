import { FindByNameJourneysControllerOutputDTO } from "../../../../dtos/journey/findByName/controllersDTO";

export const presenter = (
  input: FindByNameJourneysControllerOutputDTO
): FindByNameJourneysControllerOutputDTO => {
  const response = {
    journeys: input.journeys,
  };
  return response;
};
