export interface SettingsGateway {
  create(idUser: string): Promise<void>;
  findByIdUser(
    idUser: string
  ): Promise<{ primaryColor: string; secondaryColor: string } | null>;
  updateColorSchema(
    idUser: string,
    newColorShema: { primaryColor: string; secondaryColor: string }
  ): Promise<void>;
}
