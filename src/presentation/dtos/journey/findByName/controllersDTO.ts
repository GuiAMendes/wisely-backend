import { Journey } from "../../../../domain/entity/journey/Journey";

export type FindByNameJourneysControllerInputDTO = {
  idDirectory: string;
  journeyName: string;
};

export type FindByNameJourneysControllerOutputDTO = {
  journeys: Journey[];
};
