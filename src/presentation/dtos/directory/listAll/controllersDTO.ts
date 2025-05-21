import { Directory } from "../../../../domain/entity/directory/Directory";

export type ListAllDirectoriesControllerInputDTO = {
  idUser: string;
};

export type ListAllDirectoriesControllerOutputDTO = {
  directories: Directory[];
};
