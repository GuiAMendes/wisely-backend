import { ResumeStatisticsOfProgressControllerOutputDTO } from "../../../../dtos/progress/resumeStatistics/controllersDTO";

export const presenter = (
  input: ResumeStatisticsOfProgressControllerOutputDTO
): ResumeStatisticsOfProgressControllerOutputDTO => {
  const response = {
    idUser: input.idUser,
    totalJourneys: input.totalJourneys,
    completedJourneys: input.completedJourneys,
    totalTopics: input.totalTopics,
    completedTopics: input.completedTopics,
    completionPercentage: input.completionPercentage,
    journeysProgress: input.journeysProgress,
  };
  return response;
};
