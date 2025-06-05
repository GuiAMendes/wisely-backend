import { FileModel } from "../../../../domain/entity/fileModel/FileModel";


export type ListAllFilesUseCaseInputDTO = {
  idTopic: string;
};

export type ListAllFilesUseCaseOutputDTO = {
  files: FileModel[];
};
