import { DeactivateTopicUseCaseOutputDTO } from "../../../../dtos/topic/deactivate/usecaseDTO";

export const presenter = (
  input: DeactivateTopicUseCaseOutputDTO
): DeactivateTopicUseCaseOutputDTO => {
  const response = {
    idTopic: input.idTopic,
    status: input.status,
  };
  return response;
};
