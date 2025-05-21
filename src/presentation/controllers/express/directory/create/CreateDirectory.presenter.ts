import { CreateDirectoryControllerOutputDTO } from "../../../../dtos/directory/create/controllersDTO";

export const presenter = (
  input: CreateDirectoryControllerOutputDTO
): CreateDirectoryControllerOutputDTO => {
  const response = {
    id: input.id,
    name: input.name,
  };
  return response;
};
