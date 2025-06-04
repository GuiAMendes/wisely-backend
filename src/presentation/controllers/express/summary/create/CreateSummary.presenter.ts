import { CreateSummaryControllerOutputDTO } from "../../../../dtos/summary/create/controllersDTO";

export const presenter = (
  input: CreateSummaryControllerOutputDTO
): CreateSummaryControllerOutputDTO => {
  const response = {
    id: input.id,
  };
  return response;
};
