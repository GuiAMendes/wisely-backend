// Value-Object
import { Question, Response } from "./value-object";

// Types
export interface FlashcardProps {
  id: string;
  topicId: string;
  question: Question;
  response: Response;
  createdAt: Date | null;
  updatedAt?: Date | null;
  completedAt?: Date | null;
  isActive: boolean;
}

// Interface
import { UuidGenerator } from "../../../infra/services/uuid/interfaces/UuidGenerator.interfaces";

export class Flashcard {
  private constructor(
    readonly props: FlashcardProps,
    private readonly uuidGenerator: UuidGenerator
  ) {}

  public static create(props: {
    idTopic: string;
    questionContent: string;
    responseContent: string;
    uuidGenerator: UuidGenerator;
  }) {
    const question = Question.create(props.questionContent);
    const response = Response.create(props.responseContent);

    return new Flashcard(
      {
        id: props.uuidGenerator.generate(),
        topicId: props.idTopic,
        question,
        response,
        createdAt: null,
        updatedAt: null,
        completedAt: null,
        isActive: true,
      },
      props.uuidGenerator
    );
  }

  public edit(questionContent: string, responseContent: string) {
    return Flashcard.create({
      idTopic: this.topicId,
      questionContent,
      responseContent,
      uuidGenerator: this.uuidGenerator,
    });
  }

  private onChange(updated: Partial<FlashcardProps>) {
    return new Flashcard(
      {
        ...this.props,
        ...updated,
      },
      this.uuidGenerator
    );
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

  public get topicId() {
    return this.props.topicId;
  }

  public get questionValue() {
    return this.props.question.value;
  }

  public get responseValue() {
    return this.props.response.value;
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
