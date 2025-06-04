import { Topic } from "../../../../domain/entity/topic/Topic";

export type ListAllTopicsControllerInputDTO = {
  idJourney: string;
};

export type ListAllTopicsControllerOutputDTO = {
  topics: Topic[];
};
