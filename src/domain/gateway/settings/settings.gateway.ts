export interface SettingsGateway {
  create(idUser: string): Promise<void>;
  findByIdUser(idUser: string): Promise<string | null>;
  updateColorSchema(idUser: string, newColorShema: string): Promise<void>;
}
