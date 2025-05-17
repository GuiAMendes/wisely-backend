// Validators
import { PasswordValidator } from "../../validator/password.validator";

// Constants
import { QUANTITY_OF_ROUNDS } from "../../constants/password.constants";

// Types
export type PasswordProps = {
  hashPassword: string;
};

// Interfaces
import { Cryptation } from "../../../../infra/services/cryptation/interfaces/Cryptation.interfaces";

export class Password {
  private constructor(readonly props: PasswordProps) {}

  public static async create(plainText: string, cryptation: Cryptation) {
    PasswordValidator.ensureSafeContent(plainText);
    PasswordValidator.ensureRequiredCharacters(plainText);
    PasswordValidator.ensureMinimalLenght(plainText);

    const encryption = await cryptation.hash(plainText, QUANTITY_OF_ROUNDS);

    return new Password({
      hashPassword: encryption,
    });
  }

  public static restore(props: PasswordProps) {
    return new Password({
      hashPassword: props.hashPassword,
    });
  }

  public async compare(
    plainText: string,
    cryptation: Cryptation
  ): Promise<boolean> {
    return cryptation.compare(plainText, this.props.hashPassword);
  }

  public get hash() {
    return this.props.hashPassword;
  }
}
