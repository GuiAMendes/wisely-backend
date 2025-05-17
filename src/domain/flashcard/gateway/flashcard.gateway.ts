// Entity
import { Flashcard } from "../entity";

export interface FlashcardGateway {
  create(Flashcard: Flashcard): Promise<Flashcard>;
  update(Flashcard: Flashcard): Promise<Flashcard>;
  findById(id: string): Promise<Flashcard | null>;
  listAll(idTopic: string): Promise<Flashcard[]>;
  listRecentAccess(idTopic: string): Promise<Flashcard[]>;
  complete(id: string): Promise<Flashcard>;
  deactivate(id: string): Promise<Flashcard>;
}
