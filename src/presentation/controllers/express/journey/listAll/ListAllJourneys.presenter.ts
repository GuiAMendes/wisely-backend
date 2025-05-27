import { ListAllJourneysControllerOutputDTO } from "../../../../dtos/journey/listAll/controllersDTO";

export const presenter = (
  input: ListAllJourneysControllerOutputDTO
): ListAllJourneysControllerOutputDTO => {
  const response = {
    journeys: input.journeys,
  };
  return response;
};
