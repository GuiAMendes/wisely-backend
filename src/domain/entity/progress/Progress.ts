// Validator
import { ProgressValidator } from "../../validator/progress/progress.validator";

// Types
export interface ProgressProps {
  journeyId: string;
  completedTopics: number;
  totalTopics: number;
  updatedAt: Date | null;
  isActive: boolean;
}

export class Progress {
  private constructor(readonly props: ProgressProps) {}

  public static create(props: { journeyId: string }): Progress {
    return new Progress({
      journeyId: props.journeyId,
      completedTopics: 0,
      totalTopics: 0,
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

  public updateCompletedTopics(): Progress {
    const count = this.props.completedTopics + 1;
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
