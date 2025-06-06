import { Flashcard } from "../../../../domain/entity/flashcard/Flashcard";

export type ListAllFlashcardsUseCaseInputDTO = {
  idTopic: string;
};

export type ListAllFlashcardsUseCaseOutputDTO = {
  flashcards: Flashcard[];
};
