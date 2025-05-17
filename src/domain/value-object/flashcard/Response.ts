// Validator
import { FlashcardValidator } from "../../validator/flashcard/flashcard.validator";

// Types
export interface ResponseProps {
  value: string;
}

export class Response {
  private constructor(public readonly props: ResponseProps) {}

  public static create(value: string): Response {
    FlashcardValidator.ensureValidResponse(value);
    return new Response({ value: value });
  }

  public static restore(props: ResponseProps) {
    return new Response({
      value: props.value,
    });
  }

  public get value() {
    return this.props.value;
  }

  public equals(other: Response) {
    return this.value === other.value;
  }
}
