// Validators
import { EmailValidator } from "../../validator/user";

// Types
export type EmailProps = {
  address: string;
};

export class Email {
  private constructor(readonly props: EmailProps) {}

  public static create(address: string) {
    EmailValidator.ensureSafeContent(address);
    EmailValidator.ensureValidContent(address);

    return new Email({
      address,
    });
  }

  public static restore(props: EmailProps) {
    return new Email({
      address: props.address,
    });
  }

  public get address() {
    return this.props.address;
  }

  public equals(email: Email): boolean {
    return this.address === email.address;
  }
}
