import { UpdateContentOfSummaryControllerOutputDTO } from "../../../../dtos/summary/updateContent/controllersDTO";

export const presenter = (
  input: UpdateContentOfSummaryControllerOutputDTO
): UpdateContentOfSummaryControllerOutputDTO => {
  const response = {
    idSummary: input.idSummary,
    newContent: input.newContent,
  };
  return response;
};
