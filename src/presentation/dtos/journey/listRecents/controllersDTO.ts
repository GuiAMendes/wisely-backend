import { Journey } from "../../../../domain/entity/journey/Journey";

export type ListAllJourneysAccessedRecentlyControllerInputDTO = {
  idDirectory: string;
};

export type ListAllJourneysAccessedRecentlyControllerOutputDTO = {
  journeys: Journey[];
};
