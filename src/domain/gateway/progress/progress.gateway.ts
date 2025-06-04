// Entity
import { Progress } from "../../entity/progress/Progress";

export type JourneyProgressSummary = {
  journeyName: string;
  completedTopics: number;
  totalTopics: number;
  completionPercentage: number;
};

export type ResumeStatistics = {
  totalJourneys: number;
  completedJourneys: number;
  totalTopics: number;
  completedTopics: number;
  completionPercentage: number;
  journeysProgress: JourneyProgressSummary[];
};

export interface ProgressGateway {
  create(journeyId: string): Promise<void>;
  increaseCompleted(journeyId: string): Promise<void>;
  findByJourney(journeyId: string): Promise<Progress | null>;
  resumeStatistics(idUser: string): Promise<ResumeStatistics>;
}