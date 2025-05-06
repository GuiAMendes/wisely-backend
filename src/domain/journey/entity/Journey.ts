// Validators
import { JourneyValidator } from "../validator/journey.validator";
import { JourneyType, TypeOfJourney } from "./value-object/TypeOfJourney";

// Types
export type JourneyProps = {
  id: string;
  idDirectory: string;
  journeyName: string;
  typeOfJourney: JourneyType;
  createdAt: Date | null;
  updatedAt?: Date | null;
  isCompleted: boolean;
  isActive: boolean;
};

export class Journey {
  private constructor(readonly props: JourneyProps) {}

  public static create(props: {
    idDirectory: string;
    journeyName: string;
    typeOfJourney?: JourneyType;
  }) {
    JourneyValidator.ensureSafeName(props.journeyName);
    JourneyValidator.ensureJourneyNameHasMinimumLength(props.journeyName);
    JourneyValidator.ensureJourneyNameIsWithinLimit(props.journeyName);

    const typeJourney = TypeOfJourney.create(props.typeOfJourney || "free");

    return new Journey({
      id: crypto.randomUUID().toString(),
      idDirectory: props.idDirectory,
      journeyName: props.journeyName,
      typeOfJourney: typeJourney.labelType,
      createdAt: null,
      updatedAt: null,
      isCompleted: false,
      isActive: true,
    });
  }

  public static restore(props: JourneyProps) {
    return new Journey({
      id: props.id,
      idDirectory: props.idDirectory,
      journeyName: props.journeyName,
      typeOfJourney: props.typeOfJourney,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      isCompleted: props.isCompleted,
      isActive: true,
    });
  }

  private onChange(updated: Partial<JourneyProps>) {
    return new Journey({
      ...this.props,
      ...updated,
    });
  }

  public complete() {
    return this.onChange({ isCompleted: true });
  }

  public deactivate() {
    return this.onChange({ isActive: false });
  }

  public activate() {
    return this.onChange({ isActive: true });
  }

  public rename(newName: string) {
    JourneyValidator.ensureSafeName(newName);
    JourneyValidator.ensureJourneyNameHasMinimumLength(newName);
    JourneyValidator.ensureJourneyNameIsWithinLimit(newName);
    return this.onChange({ journeyName: newName });
  }

  public changeType(type: string) {
    const typeJourney = TypeOfJourney.create(type);
    return this.onChange({ typeOfJourney: typeJourney.labelType });
  }

  public get id() {
    return this.props.id;
  }

  public get idDirectory() {
    return this.props.idDirectory;
  }

  public get journeyName() {
    return this.props.journeyName;
  }

  public get typeOfJourney() {
    return this.props.typeOfJourney;
  }

  public get isCompleted() {
    return this.props.isCompleted;
  }

  public get isActive() {
    return this.props.isActive;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get updatedAt() {
    return this.props.updatedAt;
  }
}
