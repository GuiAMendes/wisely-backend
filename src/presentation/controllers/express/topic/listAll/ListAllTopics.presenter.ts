import { ListAllTopicsControllerOutputDTO } from "../../../../dtos/topic/listAll/controllersDTO";

export const presenter = (
  input: ListAllTopicsControllerOutputDTO
): ListAllTopicsControllerOutputDTO => {
  const response = {
    topics: input.topics,
  };
  return response;
};
