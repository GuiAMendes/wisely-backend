import { Summary } from "../../../../domain/entity/summary/Summary";

export type FindByTopicSummaryControllerInputDTO = {
  idTopic: string;
};

export type FindByTopicSummaryControllerOutputDTO = {
  summary: Summary;
};
