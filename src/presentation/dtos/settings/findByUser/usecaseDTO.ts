export type FindByUserSettingsUseCaseInputDTO = {
  idUser: string;
};

export type FindByUserSettingsUseCaseOutputDTO = {
  colorSchema: {
    primaryColor: string;
    secondaryColor: string;
  };
};
