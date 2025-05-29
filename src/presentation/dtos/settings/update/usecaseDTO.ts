export type UpdateSettingsUseCaseInputDTO = {
  idUser: string;
  colorSchema: { primaryColor: string; secondaryColor: string };
};

export type UpdateSettingsUseCaseOutputDTO = {
  status: string;
};
