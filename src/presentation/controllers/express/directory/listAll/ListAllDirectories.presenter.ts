import { ListAllDirectoriesControllerOutputDTO } from "../../../../dtos/directory/listAll/controllersDTO";

export const presenter = (
  input: ListAllDirectoriesControllerOutputDTO
): ListAllDirectoriesControllerOutputDTO => {
  const response = {
    directories: input.directories,
  };
  return response;
};
