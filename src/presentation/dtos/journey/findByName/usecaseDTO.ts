import { Journey } from "../../../../domain/entity/journey/Journey";

export type FindByNameJourneysUseCaseInputDTO = {
  idDirectory: string;
  journeyName: string;
};

export type FindByNameJourneysUseCaseOutputDTO = {
  journeys: Journey[];
};
