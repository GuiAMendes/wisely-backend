// Validators
import { isEmpty, isSafe } from "../../../shared/validators/index";

export class EmailValidator {
  public static ensureValidContent(address: string): boolean {
    if (isEmpty(address)) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(address);
  }

  public static ensureSafeContent(address: string): boolean {
    return isSafe(address);
  }
}
