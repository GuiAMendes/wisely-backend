// Entity
import { Directory } from "../../entity/directory/Directory";

export interface DirectoryGateway {
  create(directory: Directory): Promise<void>;
  findById(id: string): Promise<Directory | null>;
  findByName(directoryName: string): Promise<Directory[]>;
  listAll(idUser: string): Promise<Directory[]>;
  listRecentAccess(idUser: string): Promise<Directory[]>;
  update(directory: Directory): Promise<void>;
  complete(id: string): Promise<void>;
  deactivate(id: string): Promise<void>;
}
