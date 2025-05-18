// Entity
import { User } from "../../entity/user/User";

export interface UserGateway {
  create(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(user: User): Promise<void>;
  deactivate(id: string): Promise<void>;
}
