export type CreateDirectoryUseCaseInputDTO = {
  name: string;
  idUser: string;
  isTemplate?: boolean;
};

export type CreateDirectoryUseCaseOutputDTO = {
  id: string;
  name: string;
};
