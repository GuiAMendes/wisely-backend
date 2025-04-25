// Value Objects
import { Email, Password } from "./value-object/index";

// Validators
import { UserValidator } from "../validator";

// Types
export type UserProps = {
  id: string;
  username: string;
  email: Email;
  password: Password;
  isActive: boolean;
};

export class User {
  private constructor(readonly props: UserProps) {}

  public static async create(
    username: string,
    email: string,
    password: string
  ) {
    UserValidator.ensureSafeName(username);
    const userEmail: Email = Email.create(email);
    const userPassword = await Password.create(password);

    return new User({
      id: crypto.randomUUID().toString(),
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

  public deactivate() {
    return this.onChange({ isActive: false });
  }

  public activate() {
    return this.onChange({ isActive: false });
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
}
