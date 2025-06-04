import { CreateTopicControllerOutputDTO } from "../../../../dtos/topic/create/controllersDTO";

export const presenter = (
  input: CreateTopicControllerOutputDTO
): CreateTopicControllerOutputDTO => {
  const response = {
    id: input.id,
  };
  return response;
};
