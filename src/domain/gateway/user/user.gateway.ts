// Entity
import { User } from "../../entity/user/User";

export interface UserGateway {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(user: User): Promise<User>;
  deactivate(id: string): Promise<User>;
}
