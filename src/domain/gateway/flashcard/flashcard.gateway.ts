// Entity
import { Flashcard } from "../../entity/flashcard/Flashcard";

export interface FlashcardGateway {
  create(Flashcard: Flashcard): Promise<void>;
  update(Flashcard: Flashcard): Promise<void>;
  findById(id: string): Promise<Flashcard | null>;
  listAll(idTopic: string): Promise<Flashcard[]>;
  listRecentAccess(idTopic: string): Promise<Flashcard[]>;
  complete(id: string): Promise<void>;
  deactivate(id: string): Promise<void>;
}
