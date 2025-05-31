import { CreateProgressControllerOutputDTO } from "../../../../dtos/progress/create/controllersDTO";

export const presenter = (
  input: CreateProgressControllerOutputDTO
): CreateProgressControllerOutputDTO => {
  const response = {
    idJourney: input.idJourney,
  };
  return response;
};
