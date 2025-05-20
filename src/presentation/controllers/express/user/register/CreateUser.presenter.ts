import { CreateUserControllerOutputDTO } from "../../../../dtos/user/create/controllersDTO";

export const presenter = (
  input: CreateUserControllerOutputDTO
): CreateUserControllerOutputDTO => {
  const response = {
    id: input.id,
  };
  return response;
};
