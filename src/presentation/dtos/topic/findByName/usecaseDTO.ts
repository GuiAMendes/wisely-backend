import { Topic } from "../../../../domain/entity/topic/Topic";

export type FindByNameTopicsUseCaseInputDTO = {
  idJourney: string;
  topicName: string;
};

export type FindByNameTopicsUseCaseOutputDTO = {
  topics: Topic[];
};
