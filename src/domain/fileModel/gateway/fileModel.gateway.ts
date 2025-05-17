// Entity
import { FileModel } from "../entity";

export interface FileModelGateway {
  create(FileModel: FileModel): Promise<FileModel>;
  findById(id: string): Promise<FileModel | null>;
  listAll(idTopic: string): Promise<FileModel[]>;
  deactivate(id: string): Promise<FileModel>;
}
