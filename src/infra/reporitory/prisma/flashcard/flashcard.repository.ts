// Entity
import { Flashcard } from "../../../../domain/entity/flashcard/Flashcard";

// Value Object
import { Question } from "../../../../domain/value-object/flashcard/Question";
import { Response } from "../../../../domain/value-object/flashcard/Response";

// Service
import { PrismaClient } from "../../../../generated/prisma";

// Interface
import type { FlashcardGateway } from "../../../../domain/gateway/flashcard/flashcard.gateway";

//  Errors
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class FlashcardRepositoryPrisma implements FlashcardGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static with(prismaClient: PrismaClient) {
    return new FlashcardRepositoryPrisma(prismaClient);
  }

  async create(flashcard: Flashcard): Promise<void> {
    const flashcardData = {
      id: flashcard.id,
      id_topic: flashcard.topicId,
      question: flashcard.questionValue,
      response: flashcard.responseValue,
      completed_at: flashcard.completedAt,
      is_active: flashcard.isActive,
    };
    try {
      await this.prismaClient.flashcard.create({
        data: flashcardData,
      });
    } catch (error) {
      console.error("Failed to create flashcard:", error);
      throw new DatabaseError("Database error while creating flashcard.");
    }
  }

  async findById(id: string): Promise<Flashcard | null> {
    try {
      const dbFlashcard = await this.prismaClient.flashcard.findUnique({
        where: {
          id,
          is_active: true,
        },
      });
      if (!dbFlashcard) return null;

      const flashcard = Flashcard.restore({
        id: dbFlashcard.id,
        topicId: dbFlashcard.id_topic,
        question: Question.create(dbFlashcard.question),
        response: Response.create(dbFlashcard.response),
        createdAt: dbFlashcard.created_at,
        updatedAt: dbFlashcard.updated_at,
        completedAt: dbFlashcard.completed_at,
        isActive: dbFlashcard.is_active || false,
      });

      return flashcard;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find flashcard by ID:", error);
      throw new DatabaseError("Database error while retrieving flashcard.");
    }
  }

  async listAll(idTopic: string): Promise<Flashcard[]> {
    try {
      const dbFlashcardList = await this.prismaClient.flashcard.findMany({
        where: {
          id_topic: idTopic,
          is_active: true,
        },
      });

      if (!dbFlashcardList) return [];

      const flashcardList = dbFlashcardList.map((card) => {
        const flashcard = Flashcard.restore({
          id: card.id,
          topicId: card.id_topic,
          question: Question.create(card.question),
          response: Response.create(card.response),
          createdAt: card.created_at,
          updatedAt: card.updated_at,
          completedAt: card.completed_at,
          isActive: card.is_active || false,
        });
        return flashcard;
      });

      return flashcardList;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find flashcards: ", error);
      throw new DatabaseError("Database error while request flashcards.");
    }
  }

  async deactivate(id: string): Promise<void> {
    try {
      const dbFlashcard = await this.findById(id);

      if (!dbFlashcard) return;

      const deactivateFlashcard = dbFlashcard.deactivate();

      await this.prismaClient.flashcard.update({
        where: {
          id: dbFlashcard.id,
        },
        data: {
          is_active: deactivateFlashcard.isActive,
        },
      });
    } catch (error) {
      console.error("Failed to deactivate flashcard:", error);
      throw new DatabaseError("Database error while deactivating flashcard.");
    }
  }
 
  async updateQuestion(id: string, newQuestion: string): Promise<void> {
      try {
        await this.prismaClient.flashcard.update({
          where: { id },
          data: { question: newQuestion },
        });
      } catch (error) {
        console.error("Failed to update question of flashcard:", error);
        throw new DatabaseError("Database error while updating question of flashcard.");
      }
  }

  async updateResponse(id: string, newResponse: string): Promise<void> {
    try {
      await this.prismaClient.flashcard.update({
        where: { id },
        data: { response: newResponse },
      });
    } catch (error) {
      console.error("Failed to update response of flashcard:", error);
      throw new DatabaseError("Database error while updating response of flashcard.");
    }
  }

}
