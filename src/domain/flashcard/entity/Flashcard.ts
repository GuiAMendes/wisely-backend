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

export class Flashcard {
  private constructor(readonly props: FlashcardProps) {}

  public static create(props: {
    idTopic: string;
    questionContent: string;
    responseContent: string;
  }) {
    const question = Question.create(props.questionContent);
    const response = Response.create(props.responseContent);

    return new Flashcard({
      id: crypto.randomUUID().toString(),
      topicId: props.idTopic,
      question,
      response,
      createdAt: null,
      updatedAt: null,
      completedAt: null,
      isActive: true,
    });
  }

  public edit(questionContent: string, responseContent: string) {
    return Flashcard.create({
      idTopic: this.topicId,
      questionContent,
      responseContent,
    });
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
