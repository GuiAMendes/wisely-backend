import { FindByNameTopicsControllerOutputDTO } from "../../../../dtos/topic/findByName/controllersDTO";

export const presenter = (
  input: FindByNameTopicsControllerOutputDTO
): FindByNameTopicsControllerOutputDTO => {
  const response = {
    topics: input.topics,
  };
  return response;
};
