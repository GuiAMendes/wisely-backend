import { IncreaseProgressControllerOutputDTO } from "../../../../dtos/progress/increaseCompleted/controllersDTO";

export const presenter = (
  input: IncreaseProgressControllerOutputDTO
): IncreaseProgressControllerOutputDTO => {
  const response = {
    idJourney: input.idJourney,
    completedTopics: input.completedTopics,
    totalTopics: input.totalTopics,
  };
  return response;
};
