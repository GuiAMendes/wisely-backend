import { Topic } from "../../../../domain/entity/topic/Topic";

export type FindByNameTopicsControllerInputDTO = {
  idJourney: string;
  topicName: string;
};

export type FindByNameTopicsControllerOutputDTO = {
  topics: Topic[];
};
