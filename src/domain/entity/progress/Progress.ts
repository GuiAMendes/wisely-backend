// Validator
import { ProgressValidator } from "../../validator/progress/progress.validator";

// Types
export interface ProgressProps {
  id: string;
  journeyId: string;
  completedTopics: number;
  totalTopics: number;
  updatedAt: Date | null;
  isActive: boolean;
}

// Interfaces
import { UuidGenerator } from "../../../infra/services/uuid/interfaces/UuidGenerator.interfaces";

export class Progress {
  private constructor(readonly props: ProgressProps) {}

  public static create(props: {
    journeyId: string;
    totalTopics: number;
    uuidGenerator: UuidGenerator;
  }): Progress {
    ProgressValidator.ensureTotalTopicsValid(props.totalTopics);

    return new Progress({
      id: props.uuidGenerator.generate(),
      journeyId: props.journeyId,
      completedTopics: 0,
      totalTopics: props.totalTopics,
      updatedAt: null,
      isActive: true,
    });
  }

  public static restore(props: ProgressProps): Progress {
    ProgressValidator.ensureTotalTopicsValid(props.totalTopics);
    ProgressValidator.ensureCompletedNotExceedsTotal(
      props.completedTopics,
      props.totalTopics
    );

    return new Progress(props);
  }

  public updateCompletedTopics(count: number): Progress {
    ProgressValidator.ensureCompletedNotExceedsTotal(
      count,
      this.props.totalTopics
    );

    return new Progress({
      ...this.props,
      completedTopics: count,
    });
  }

  public deactivate(): Progress {
    return new Progress({
      ...this.props,
      isActive: false,
    });
  }

  public activate(): Progress {
    return new Progress({
      ...this.props,
      isActive: true,
    });
  }

  public get id() {
    return this.props.id;
  }

  public get journeyId() {
    return this.props.journeyId;
  }

  public get completedTopics() {
    return this.props.completedTopics;
  }

  public get totalTopics() {
    return this.props.totalTopics;
  }

  public get updatedAt() {
    return this.props.updatedAt;
  }

  public get isActive() {
    return this.props.isActive;
  }
}
