export type FindByUserSettingsControllerInputDTO = {
  idUser: string;
};

export type FindByUserSettingsControllerOutputDTO = {
  colorSchema: {
    primaryColor: string;
    secondaryColor: string;
  };
};
