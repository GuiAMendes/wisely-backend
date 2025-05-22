import { Directory } from "../../../../domain/entity/directory/Directory";

export type FindByNameDirectoriesUseCaseInputDTO = {
  idUser: string;
  directoryName: string;
};

export type FindByNameDirectoriesUseCaseOutputDTO = {
  directories: Directory[];
};
