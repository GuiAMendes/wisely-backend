import { Flashcard } from "../../../../domain/entity/flashcard/Flashcard";

export type ListAllFlashcardsControllerInputDTO = {
  idTopic: string;
};

export type ListAllFlashcardsControllerOutputDTO = {
  flashcards: Flashcard[];
};
