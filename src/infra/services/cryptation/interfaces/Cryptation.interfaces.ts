export interface Cryptation {
  hash(password: string, salt: number | string): Promise<string>;
  compare(password: string, hashContent: string): Promise<boolean>;
}
