// Entity
import { User } from "../entity";

export interface UserGateway {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(user: User): Promise<User>;
  desactive(id: string): Promise<User>;
}
