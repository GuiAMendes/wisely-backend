import { JourneyProgressSummary } from "../../../../domain/gateway/progress/progress.gateway";

export type ResumeStatisticsOfProgressControllerInputDTO = {
  idUser: string;
  totalJourneys: number;
  completedJourneys: number;
  totalTopics: number;
  completedTopics: number;
  completionPercentage: number;
  journeysProgress: JourneyProgressSummary[];
};

export type ResumeStatisticsOfProgressControllerOutputDTO = {
  idUser: string;
  totalJourneys: number;
  completedJourneys: number;
  totalTopics: number;
  completedTopics: number;
  completionPercentage: number;
  journeysProgress: JourneyProgressSummary[];
};
