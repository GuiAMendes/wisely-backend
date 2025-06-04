import { Topic } from "../../../../domain/entity/topic/Topic";

export type ListAllTopicsUseCaseInputDTO = {
  idJourney: string;
};

export type ListAllTopicsUseCaseOutputDTO = {
  topics: Topic[];
};
