// Validator
import { FlashcardValidator } from "../../validator/flashcard/flashcard.validator";

// Types
export interface QuestionProps {
  value: string;
}

export class Question {
  private constructor(public readonly props: QuestionProps) {}

  public static create(value: string): Question {
    FlashcardValidator.ensureValidQuestion(value);
    return new Question({ value: value });
  }

  public static restore(props: QuestionProps) {
    return new Question({
      value: props.value,
    });
  }

  public get value() {
    return this.props.value;
  }

  public equals(other: Question) {
    return this.value === other.value;
  }
}
