import { RenameDirectoryControllerOutputDTO } from "../../../../dtos/directory/rename/controllersDTO";

export const presenter = (
  input: RenameDirectoryControllerOutputDTO
): RenameDirectoryControllerOutputDTO => {
  const response = {
    idDirectory: input.idDirectory,
    newDirectoryName: input.newDirectoryName,
  };
  return response;
};
