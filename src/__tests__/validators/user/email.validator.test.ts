// Validator
import { EmailValidator } from "../../../domain/validator/user";

describe("EmailValidator", () => {
  describe("ensureValidContent", () => {
    it("should return false for empty email", () => {
      expect(EmailValidator.ensureValidContent("")).toBe(false);
    });

    it("should return false for invalid email", () => {
      expect(EmailValidator.ensureValidContent("invalid-email")).toBe(false);
      expect(EmailValidator.ensureValidContent("test@")).toBe(false);
      expect(EmailValidator.ensureValidContent("@domain.com")).toBe(false);
    });

    it("should return true for valid email", () => {
      expect(EmailValidator.ensureValidContent("test@example.com")).toBe(true);
    });
  });

  describe("ensureSafeContent", () => {
    it("should return false for unsafe email", () => {
      expect(
        EmailValidator.ensureSafeContent("DROP TABLE users@example.com")
      ).toBe(false);
    });

    it("should return true for safe email", () => {
      expect(EmailValidator.ensureSafeContent("normal.email@example.com")).toBe(
        true
      );
    });
  });
});
