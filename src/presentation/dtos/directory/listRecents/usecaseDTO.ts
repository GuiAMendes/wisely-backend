import { Directory } from "../../../../domain/entity/directory/Directory";

export type ListDirectoriesAccessedRecentlyUseCaseInputDTO = {
  idUser: string;
};

export type ListDirectoriesAccessedRecentlyUseCaseOutputDTO = {
  directories: Directory[];
};
