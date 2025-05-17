import { UuidGenerator } from "./interfaces/UuidGenerator.interfaces";

export class CryptoUuidGenerator implements UuidGenerator {
  generate(): string {
    return crypto.randomUUID().toString();
  }
}
