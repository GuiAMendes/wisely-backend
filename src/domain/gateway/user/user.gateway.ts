// Entity
import { User } from "../../entity/user/User";

export interface UserGateway {
  create(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  updateName(id: string, newUsername: string): Promise<void>;
  deactivate(id: string): Promise<void>;
}
