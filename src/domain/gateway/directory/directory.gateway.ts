// Entity
import { Directory } from "../../entity/directory/Directory";

export interface DirectoryGateway {
  create(directory: Directory): Promise<Directory>;
  findById(id: string): Promise<Directory | null>;
  findByUser(idUser: string): Promise<Directory[]>;
  findByName(directoryName: string): Promise<Directory[]>;
  listAll(idUser: string): Promise<Directory[]>;
  listRecentAccess(idUser: string): Promise<Directory[]>;
  update(directory: Directory): Promise<Directory>;
  complete(id: string): Promise<Directory>;
  deactivate(id: string): Promise<Directory>;
}
