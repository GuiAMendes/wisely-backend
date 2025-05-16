// Validator
import { SummaryValidator } from "../validator/summary.validator";

// Value-Object
import { Note } from "./value-object/Note";

// Types
export type SummaryProps = {
  id: string;
  idTopic: string;
  title: string;
  note: Note;
  createdAt: Date | null;
  updatedAt?: Date | null;
  completedAt?: Date | null;
  isActive: boolean;
};

// Interface
import { UuidGenerator } from "../../../infra/services/uuid/interfaces/UuidGenerator.interfaces";

export class Summary {
  private constructor(readonly props: SummaryProps) {}

  public static create(props: {
    idTopic: string;
    title: string;
    noteContent: string;
    uuidGenerator: UuidGenerator;
  }) {
    SummaryValidator.ensureSafeTitle(props.title);
    SummaryValidator.ensureMinimalTitle(props.title);
    SummaryValidator.ensureTitleWithinLimit(props.title);

    const note = Note.create(props.noteContent);

    return new Summary({
      id: props.uuidGenerator.generate(),
      idTopic: props.idTopic,
      title: props.title,
      note,
      createdAt: null,
      updatedAt: null,
      completedAt: null,
      isActive: true,
    });
  }

  public static restore(props: SummaryProps) {
    return new Summary({
      id: props.id,
      idTopic: props.idTopic,
      title: props.title,
      note: props.note,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      completedAt: props.completedAt,
      isActive: props.isActive,
    });
  }

  private onChange(updated: Partial<SummaryProps>) {
    return new Summary({
      ...this.props,
      ...updated,
    });
  }

  public editTitle(newTitle: string) {
    SummaryValidator.ensureSafeTitle(newTitle);
    SummaryValidator.ensureMinimalTitle(newTitle);
    SummaryValidator.ensureTitleWithinLimit(newTitle);
    return this.onChange({ title: newTitle });
  }

  public editNote(newContent: string) {
    return this.onChange({ note: Note.create(newContent) });
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

  public get idTopic() {
    return this.props.idTopic;
  }

  public get title() {
    return this.props.title;
  }

  public get note() {
    return this.props.note.value;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get updatedAt() {
    return this.props.updatedAt;
  }

  public get completedAt() {
    return this.props.completedAt;
  }

  public get isActive() {
    return this.props.isActive;
  }
}
