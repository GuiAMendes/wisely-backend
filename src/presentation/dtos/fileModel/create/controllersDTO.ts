export type CreateFileControllerInputDTO = {
  fileName: string;
  fileType: string;
  fileContent: string;
};

export type CreateFileControllerOutputDTO = {
  id: string;
  fileName: string;
  fileType: string;
  fileContent: string;
};
