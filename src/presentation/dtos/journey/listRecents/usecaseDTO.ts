import { Journey } from "../../../../domain/entity/journey/Journey";

export type ListAllJourneysAccessedRecentlyUseCaseInputDTO = {
  idDirectory: string;
};

export type ListAllJourneysAccessedRecentlyUseCaseOutputDTO = {
  journeys: Journey[];
};
