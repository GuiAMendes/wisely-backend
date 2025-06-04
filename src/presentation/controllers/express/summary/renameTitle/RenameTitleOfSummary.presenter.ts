import { RenameTitleOfSummaryControllerOutputDTO } from "../../../../dtos/summary/renameTitle/controllersDTO";

export const presenter = (
  input: RenameTitleOfSummaryControllerOutputDTO
): RenameTitleOfSummaryControllerOutputDTO => {
  const response = {
    idSummary: input.idSummary,
    newTitle: input.newTitle,
  };
  return response;
};
