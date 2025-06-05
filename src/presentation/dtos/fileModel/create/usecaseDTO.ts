export type CreateFileUseCaseInputDTO = {
  idTopic: string;
  fileName: string;
  fileType: string;
  fileContent: string;
};

export type CreateFileUseCaseOutputDTO = {
  id: string;
  fileName: string;
  fileType: string;
  fileContent: string;
};
