import { ListDirectoriesAccessedRecentlyControllerOutputDTO } from "../../../../dtos/directory/listRecents/controllersDTO";

export const presenter = (
  input: ListDirectoriesAccessedRecentlyControllerOutputDTO
): ListDirectoriesAccessedRecentlyControllerOutputDTO => {
  const response = {
    directories: input.directories,
  };
  return response;
};
