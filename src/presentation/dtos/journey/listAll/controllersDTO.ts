import { Journey } from "../../../../domain/entity/journey/Journey";

export type ListAllJourneysControllerInputDTO = {
  idDirectory: string;
};

export type ListAllJourneysControllerOutputDTO = {
  journeys: Journey[];
};
