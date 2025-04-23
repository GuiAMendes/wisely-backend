// External libraries
import bcrypt from "bcrypt";

// Validators
import { PasswordValidator } from "../../validator/password.validator";

// Constants
import { QUANTITY_OF_ROUNDS } from "../../constants/password.constants";

// Types
export type PasswordProps = {
  hashPassword: string;
};

export class Password {
  private constructor(readonly props: PasswordProps) {}

  public static async create(plainText: string) {
    PasswordValidator.ensureSafeContent(plainText);
    PasswordValidator.ensureRequiredCharacters(plainText);
    PasswordValidator.ensureMinimalLenght(plainText);

    const encryption = await Password.generateHash(plainText);

    return new Password({
      hashPassword: encryption,
    });
  }

  public static restore(props: PasswordProps) {
    return new Password({
      hashPassword: props.hashPassword,
    });
  }

  private static async generateHash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, QUANTITY_OF_ROUNDS);
  }

  public async compare(plainText: string): Promise<boolean> {
    return await bcrypt.compare(plainText, this.props.hashPassword);
  }

  protected get hashPassword() {
    return this.props.hashPassword;
  }
}
