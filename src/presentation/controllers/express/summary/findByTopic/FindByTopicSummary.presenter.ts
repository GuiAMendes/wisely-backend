import { FindByTopicSummaryControllerOutputDTO } from "../../../../dtos/summary/findByTopic/controllersDTO";

export const presenter = (
  input: FindByTopicSummaryControllerOutputDTO
): FindByTopicSummaryControllerOutputDTO => {
  const response = {
    summary: input.summary,
  };
  return response;
};
