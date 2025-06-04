import { RenameTopicControllerOutputDTO } from "../../../../dtos/topic/rename/controllersDTO";

export const presenter = (
  input: RenameTopicControllerOutputDTO
): RenameTopicControllerOutputDTO => {
  const response = {
    idTopic: input.idTopic,
    newTopicName: input.newTopicName,
  };
  return response;
};
