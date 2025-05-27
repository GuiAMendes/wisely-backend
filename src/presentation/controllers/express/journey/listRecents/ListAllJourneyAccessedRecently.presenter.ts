import { ListAllJourneysAccessedRecentlyControllerOutputDTO } from "../../../../dtos/journey/listRecents/controllersDTO";

export const presenter = (
  input: ListAllJourneysAccessedRecentlyControllerOutputDTO
): ListAllJourneysAccessedRecentlyControllerOutputDTO => {
  const response = {
    journeys: input.journeys,
  };
  return response;
};
