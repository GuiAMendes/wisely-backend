// Entity
import { Directory } from "../../entity/directory/Directory";

export interface DirectoryGateway {
  create(directory: Directory): Promise<void>;
  findById(id: string): Promise<Directory | null>;
  findByName(idUser: string, directoryName: string): Promise<Directory[]>;
  listAll(idUser: string): Promise<Directory[]>;
  listRecentAccess(idUser: string): Promise<Directory[]>;
  updateName(id: string, newName: string): Promise<void>;
  updateDateOfAccess(id: string): Promise<void>;
  complete(id: string): Promise<void>;
  deactivate(id: string): Promise<void>;
}
