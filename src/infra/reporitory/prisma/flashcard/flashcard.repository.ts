// Entity
import { Directory } from "../../../../domain/entity/directory/Directory";

// Service
import { PrismaClient } from "../../../../generated/prisma";

// Interface
import type { FlashcardGateway } from "../../../../domain/gateway/flashcard/flashcard.gateway";

//  Errors
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";
import { Flashcard } from "../../../../domain/entity/flashcard/Flashcard";
import { Question } from "../../../../domain/value-object/flashcard/Question";
import { Response } from "../../../../domain/value-object/flashcard/Response";

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

  deactivate(id: string): Promise<void> {
    
  }
 
  // async updateName(id: string, newName: string): Promise<void> {
  //   try {
  //     await this.prismaClient.directory.update({
  //       where: { id },
  //       data: { directory_name: newName },
  //     });
  //   } catch (error) {
  //     console.error("Failed to update directory:", error);
  //     throw new DatabaseError("Database error while updating directory.");
  //   }
  // }

  // async deactivate(id: string): Promise<void> {
  //   try {
  //     const dbDirectory = await this.findById(id);

  //     if (!dbDirectory) return;

  //     const journeys = await this.prismaClient.journey.findMany({
  //       where: { id_directory: id, is_active: true },
  //       include: { topic: true },
  //     });

  //     const journeyIds = journeys.map((j) => j.id);
  //     const topicIds = journeys.flatMap((j) => j.topic.map((t) => t.id));

  //     await this.prismaClient.file_model.updateMany({
  //       where: { id_topic: { in: topicIds }, is_active: true },
  //       data: { is_active: false },
  //     });

  //     await this.prismaClient.flashcard.updateMany({
  //       where: { id_topic: { in: topicIds }, is_active: true },
  //       data: { is_active: false },
  //     });

  //     await this.prismaClient.summary.updateMany({
  //       where: { id_topic: { in: topicIds }, is_active: true },
  //       data: { is_active: false },
  //     });

  //     await this.prismaClient.topic.updateMany({
  //       where: { id: { in: topicIds }, is_active: true },
  //       data: { is_active: false },
  //     });

  //     await this.prismaClient.progress.updateMany({
  //       where: { id_journey: { in: journeyIds }, is_active: true },
  //       data: { is_active: false },
  //     });

  //     await this.prismaClient.journey.updateMany({
  //       where: { id: { in: journeyIds }, is_active: true },
  //       data: { is_active: false },
  //     });

  //     const deactivatedUser = dbDirectory.deactivate();

  //     await this.prismaClient.directory.update({
  //       where: {
  //         id: dbDirectory.id,
  //       },
  //       data: {
  //         is_active: deactivatedUser.isActive,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Failed to deactivate directory:", error);
  //     throw new DatabaseError("Database error while deactivating directory.");
  //   }
  // }
}
