import { Directory } from "../../../../domain/entity/directory/Directory";

export type ListAllDirectoriesUseCaseInputDTO = {
  idUser: string;
};

export type ListAllDirectoriesUseCaseOutputDTO = {
  directories: Directory[];
};
