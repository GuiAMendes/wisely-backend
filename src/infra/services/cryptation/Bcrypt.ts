// External Libraries
import { hash, compare } from "bcrypt";

// Interfaces
import { Cryptation } from "./interfaces/Cryptation.interfaces";

export class Bcrypt implements Cryptation {
  compare(password: string, hashContent: string): Promise<boolean> {
    return compare(password, hashContent);
  }
  hash(password: string, salt: number | string): Promise<string> {
    return hash(password, salt);
  }
}
