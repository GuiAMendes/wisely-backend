import { ListAllFilesControllerOutputDTO } from "../../../../dtos/fileModel/listAll/controllersDTO";

export const presenter = (
  input: ListAllFilesControllerOutputDTO
): ListAllFilesControllerOutputDTO => {
  const response = {
    files: input.files,
  };
  return response;
};
