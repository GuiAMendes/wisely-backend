// Validator
import {
  isEmpty,
  hasSQLInjection,
  isSafe,
  ensureSafe,
  ensureMinimalLenght,
  ensureNameWithinLimit,
} from "../../shared/validators";

describe("Shared Validators", () => {
  describe("isEmpty", () => {
    it("should return true for empty string", () => {
      expect(isEmpty("")).toBe(true);
    });

    it("should return true for string with only spaces", () => {
      expect(isEmpty("   ")).toBe(true);
    });

    it("should return false for non-empty string", () => {
      expect(isEmpty("test")).toBe(false);
    });
  });

  describe("hasSQLInjection", () => {
    it("should detect SQL keywords", () => {
      expect(hasSQLInjection("DROP TABLE users;")).toBe(true);
      expect(hasSQLInjection("SELECT * FROM users")).toBe(true);
      expect(hasSQLInjection("admin' --")).toBe(true);
    });

    it("should return false for safe input", () => {
      expect(hasSQLInjection("HelloWorld")).toBe(false);
      expect(hasSQLInjection("123abc")).toBe(false);
    });
  });

  describe("isSafe", () => {
    it("should return false for empty string", () => {
      expect(isSafe("")).toBe(false);
    });

    it("should return false for SQL injection attempt", () => {
      expect(isSafe("SELECT * FROM users")).toBe(false);
    });

    it("should return true for valid input", () => {
      expect(isSafe("TestandoInput")).toBe(true);
    });
  });

  describe("ensureSafe", () => {
    it("should throw error for unsafe input", () => {
      expect(() => ensureSafe("DROP TABLE users", "Invalid input")).toThrow(
        "Invalid input"
      );
    });

    it("should not throw for safe input", () => {
      expect(() => ensureSafe("ValidName", "Invalid input")).not.toThrow();
    });
  });

  describe("ensureMinimalLenght", () => {
    it("should throw error if input is empty", () => {
      expect(() => ensureMinimalLenght("", 3, "Too short")).toThrow(
        "Too short"
      );
    });

    it("should throw error if input is shorter than min length", () => {
      expect(() => ensureMinimalLenght("ab", 3, "Too short")).toThrow(
        "Too short"
      );
    });

    it("should not throw if input meets minimum length", () => {
      expect(() => ensureMinimalLenght("abc", 3, "Too short")).not.toThrow();
    });
  });

  describe("ensureNameWithinLimit", () => {
    it("should throw error if input is empty", () => {
      expect(() => ensureNameWithinLimit("", 5, "Too long")).toThrow(
        "Too long"
      );
    });

    it("should throw error if input exceeds max length", () => {
      expect(() => ensureNameWithinLimit("abcdef", 5, "Too long")).toThrow(
        "Too long"
      );
    });

    it("should not throw if input is within limit", () => {
      expect(() => ensureNameWithinLimit("abc", 5, "Too long")).not.toThrow();
    });
  });
});
