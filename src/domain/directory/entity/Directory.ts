// Validators
import { DirectoryValidator } from "./validator/directory.validator";

// Types
export type DirectoryProps = {
  id: string;
  idUser: string;
  directoryName: string;
  createdAt: Date | null;
  updatedAt?: Date | null;
  isCompleted: boolean;
  isActive: boolean;
  isTemplate: boolean;
};

// Interface
import { UuidGenerator } from "../../../infra/services/uuid/interfaces/UuidGenerator.interfaces";

export class Directory {
  private constructor(readonly props: DirectoryProps) {}

  public static create(props: {
    idUser: string;
    directoryName: string;
    isTemplate?: boolean;
    uuidGenerator: UuidGenerator;
  }) {
    DirectoryValidator.ensureSafeName(props.directoryName);

    return new Directory({
      id: props.uuidGenerator.generate(),
      idUser: props.idUser,
      directoryName: props.directoryName,
      createdAt: null,
      updatedAt: null,
      isCompleted: false,
      isActive: true,
      isTemplate: props.isTemplate || false,
    });
  }

  public static restore(props: DirectoryProps) {
    return new Directory({
      id: props.id,
      idUser: props.idUser,
      directoryName: props.directoryName,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      isCompleted: props.isCompleted,
      isActive: props.isActive,
      isTemplate: props.isTemplate,
    });
  }

  private onChange(updated: Partial<DirectoryProps>) {
    return new Directory({
      ...this.props,
      ...updated,
    });
  }

  public Complete() {
    return this.onChange({ isCompleted: true });
  }

  public deactivate() {
    return this.onChange({ isActive: false });
  }

  public activate() {
    return this.onChange({ isActive: true });
  }

  public rename(newName: string) {
    DirectoryValidator.ensureSafeName(newName);
    return this.onChange({ directoryName: newName });
  }

  public get id() {
    return this.props.id;
  }

  public get idUser() {
    return this.props.idUser;
  }

  public get directoryName() {
    return this.props.directoryName;
  }

  public get isCompleted() {
    return this.props.isCompleted;
  }

  public get isActive() {
    return this.props.isActive;
  }

  public get isTemplate() {
    return this.props.isTemplate;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get updatedAt() {
    return this.props.updatedAt;
  }
}
