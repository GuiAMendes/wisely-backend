import { Directory } from "../../../../domain/entity/directory/Directory";

export type ListDirectoriesAccessedRecentlyControllerInputDTO = {
  idUser: string;
};

export type ListDirectoriesAccessedRecentlyControllerOutputDTO = {
  directories: Directory[];
};
