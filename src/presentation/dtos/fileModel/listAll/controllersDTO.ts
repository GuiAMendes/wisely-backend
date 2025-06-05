import { FileModel } from "../../../../domain/entity/fileModel/FileModel";

export type ListAllFilesControllerInputDTO = {
  idTopic: string;
};

export type ListAllFilesControllerOutputDTO = {
  files: FileModel[];
};
