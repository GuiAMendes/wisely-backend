// Entity
import { Flashcard } from "../../entity/flashcard/Flashcard";

export interface FlashcardGateway {
  create(flashcard: Flashcard): Promise<void>;
  updateResponse(id: string, newResponse: string): Promise<void>;
  updateQuestion(id: string, newQuestion: string): Promise<void>;
  findById(id: string): Promise<Flashcard | null>;
  listAll(idTopic: string): Promise<Flashcard[]>;
  deactivate(id: string): Promise<void>;
}
