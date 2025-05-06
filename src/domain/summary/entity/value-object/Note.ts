// Validator
import { NoteValidator } from "../../validator/note.validator";

// Types
export interface NoteProps {
  content: string;
}

export class Note {
  private constructor(private readonly props: NoteProps) {}

  public static create(content: string) {
    NoteValidator.ensureSafeContent(content);
    NoteValidator.ensureNotEmpty(content);
    return new Note({ content: content });
  }

  public static restore(props: NoteProps) {
    return new Note({ content: props.content });
  }

  public get value() {
    return this.props.content;
  }

  public equals(other: Note) {
    return this.props.content === other.props.content;
  }
}
