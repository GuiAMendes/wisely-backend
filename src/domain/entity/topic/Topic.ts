// Validator
import { TopicValidator } from "../../validator/topic/topic.validator";

// Types
export type TopicProps = {
  id: string;
  idJourney: string;
  topicName: string;
  createdAt: Date | null;
  updatedAt?: Date | null;
  completedAt?: Date | null;
  isActive: boolean;
  isConcluded: boolean;
};

// Interface
import { UuidGenerator } from "../../../infra/services/uuid/interfaces/UuidGenerator.interfaces";

export class Topic {
  private constructor(readonly props: TopicProps) {}

  public static create(props: {
    idJourney: string;
    topicName: string;
    uuidGenerator: UuidGenerator;
  }) {
    TopicValidator.ensureSafeName(props.topicName);
    TopicValidator.ensureTopicNameHasMinimumLength(props.topicName);
    TopicValidator.ensureTopicNameIsWithinLimit(props.topicName);

    return new Topic({
      id: props.uuidGenerator.generate(),
      idJourney: props.idJourney,
      topicName: props.topicName,
      createdAt: null,
      updatedAt: null,
      completedAt: null,
      isActive: true,
      isConcluded: false,
    });
  }

  public static restore(props: TopicProps) {
    return new Topic({
      id: props.id,
      idJourney: props.idJourney,
      topicName: props.topicName,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      completedAt: props.completedAt,
      isActive: props.isActive,
      isConcluded: props.isConcluded,
    });
  }

  private onChange(updated: Partial<TopicProps>) {
    return new Topic({
      ...this.props,
      ...updated,
    });
  }

  public complete() {
    return this.onChange({ isConcluded: true });
  }

  public deactivate() {
    return this.onChange({ isActive: false });
  }

  public activate() {
    return this.onChange({ isActive: true });
  }

  public rename(newName: string) {
    TopicValidator.ensureSafeName(newName);
    TopicValidator.ensureTopicNameHasMinimumLength(newName);
    TopicValidator.ensureTopicNameIsWithinLimit(newName);
    return this.onChange({ topicName: newName });
  }

  public get id() {
    return this.props.id;
  }

  public get idJourney() {
    return this.props.idJourney;
  }

  public get topicName() {
    return this.props.topicName;
  }

  public get isActive() {
    return this.props.isActive;
  }

  public get isConcluded() {
    return this.props.isConcluded;
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
}
