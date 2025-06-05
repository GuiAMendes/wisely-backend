import { CreateFileControllerOutputDTO } from "../../../../dtos/fileModel/create/controllersDTO";

export const presenter = (
  input: CreateFileControllerOutputDTO
): CreateFileControllerOutputDTO => {
  const response = {
    id: input.id,
    fileName: input.fileName,
    fileType: input.fileType,
    fileContent: input.fileContent,
  };
  return response;
};
