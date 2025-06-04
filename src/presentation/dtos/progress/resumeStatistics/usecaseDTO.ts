import { JourneyProgressSummary } from "../../../../domain/gateway/progress/progress.gateway";

export type ResumeStatisticsOfProgressUseCaseInputDTO = {
  idUser: string;
};

export type ResumeStatisticsOfProgressUseCaseOutputDTO = {
  idUser: string;
  totalJourneys: number;
  completedJourneys: number;
  totalTopics: number;
  completedTopics: number;
  completionPercentage: number;
  journeysProgress: JourneyProgressSummary[];
};
