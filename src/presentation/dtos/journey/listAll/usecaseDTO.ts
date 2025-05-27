import { Journey } from "../../../../domain/entity/journey/Journey";

export type ListAllJourneysUseCaseInputDTO = {
  idDirectory: string;
};

export type ListAllJourneysUseCaseOutputDTO = {
  journeys: Journey[];
};
