// Validators
import { TypeOfJourneyValidator } from "../../validator/journey/typeOfJourney.validator";

// Types
export type JourneyType = "free" | "full";

export type TypeOfJourneyProps = {
  type: JourneyType;
};

export class TypeOfJourney {
  private constructor(readonly props: TypeOfJourneyProps) {}

  public static create(value: string) {
    TypeOfJourneyValidator.ensureValidType(value);

    return new TypeOfJourney({ type: value as JourneyType });
  }

  public static restore(props: TypeOfJourneyProps) {
    return new TypeOfJourney({
      type: props.type,
    });
  }

  public get labelType() {
    return this.props.type;
  }

  public equals(other: TypeOfJourney): boolean {
    return this.props.type === other.props.type;
  }
}
