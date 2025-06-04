import { CompleteTopicUseCaseOutputDTO } from "../../../../dtos/topic/complete/usecaseDTO";

export const presenter = (
  input: CompleteTopicUseCaseOutputDTO
): CompleteTopicUseCaseOutputDTO => {
  const response = {
    idTopic: input.idTopic,
    status: input.status,
  };
  return response;
};
