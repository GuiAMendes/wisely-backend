import { FindByNameDirectoriesControllerOutputDTO } from "../../../../dtos/directory/findByName/controllersDTO";

export const presenter = (
  input: FindByNameDirectoriesControllerOutputDTO
): FindByNameDirectoriesControllerOutputDTO => {
  const response = {
    directories: input.directories,
  };
  return response;
};
