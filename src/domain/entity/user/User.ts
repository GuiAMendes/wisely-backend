// Value Objects
import { Email } from "../../value-object/user/Email";
import { Password } from "../../value-object/user/Password";

// Validators
import { UserValidator } from "../../validator/user";

// Types
export type UserProps = {
  id: string;
  username: string;
  email: Email;
  password: Password;
  isActive: boolean;
};

// Interface
import { UuidGenerator } from "../../../infra/services/uuid/interfaces/UuidGenerator.interfaces";
import { Cryptation } from "../../../infra/services/cryptation/interfaces/Cryptation.interfaces";

export class User {
  private constructor(readonly props: UserProps) {}

  public static async create(
    username: string,
    email: string,
    password: string,
    uuidGenerator: UuidGenerator,
    cryptationService: Cryptation
  ) {
    UserValidator.ensureSafeName(username);
    const userEmail: Email = Email.create(email);
    const userPassword = await Password.create(password, cryptationService);

    return new User({
      id: uuidGenerator.generate(),
      username,
      email: userEmail,
      password: userPassword,
      isActive: true,
    });
  }

  private onChange(updated: Partial<UserProps>) {
    return new User({
      ...this.props,
      ...updated,
    });
  }

  public changeEmail(newEmail: string) {
    const email = Email.create(newEmail);
    return this.onChange({ email });
  }

  public deactivate() {
    return this.onChange({ isActive: false });
  }

  public activate() {
    return this.onChange({ isActive: true });
  }

  public get id() {
    return this.props.id;
  }

  public get username() {
    return this.props.username;
  }

  public get email() {
    return this.props.email.address;
  }

  public get isActive() {
    return this.props.isActive;
  }

  public get passwordHash() {
    return this.props.password.hash;
  }
}
