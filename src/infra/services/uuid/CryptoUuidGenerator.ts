import { UuidGenerator } from "./interfaces/uuidGenerator.interfaces";

export class CryptoUuidGenerator implements UuidGenerator {
  generate(): string {
    return crypto.randomUUID().toString();
  }
}
