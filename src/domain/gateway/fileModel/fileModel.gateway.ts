// Entity
import { FileModel } from "../../entity/fileModel/FileModel";

export interface FileModelGateway {
  create(fileModel: FileModel): Promise<void>;
  findById(id: string): Promise<FileModel | null>;
  listAll(idTopic: string): Promise<FileModel[]>;
  deactivate(id: string): Promise<void>;
}
