import { Summary } from "../../../../domain/entity/summary/Summary";

export type FindByTopicSummaryUseCaseInputDTO = {
  idTopic: string;
};

export type FindByTopicSummaryUseCaseOutputDTO = {
  summary: Summary;
};
