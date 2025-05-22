import { Directory } from "../../../../domain/entity/directory/Directory";

export type FindByNameDirectoriesControllerInputDTO = {
  idUser: string;
  directoryName: string;
};

export type FindByNameDirectoriesControllerOutputDTO = {
  directories: Directory[];
};
