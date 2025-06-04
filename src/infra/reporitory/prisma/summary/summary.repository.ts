// Entity
import { Summary } from "../../../../domain/entity/summary/Summary";

// Value object
import { Note } from "../../../../domain/value-object/summary/Note";

// Service
import { PrismaClient } from "../../../../generated/prisma";

// Interface
import type { SummaryGateway } from "../../../../domain/gateway/summary/summary.gateway";

//  Errors
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class SummaryRepositoryPrisma implements SummaryGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static with(prismaClient: PrismaClient) {
    return new SummaryRepositoryPrisma(prismaClient);
  }

  async create(summary: Summary): Promise<void> {
    const summaryData = {
      id: summary.id,
      id_topic: summary.idTopic,
      note: summary.note,
      title: summary.title,
      completed_at: summary.completedAt,
      is_active: summary.isActive,
    };
    try {
      await this.prismaClient.summary.create({
        data: summaryData,
      });
    } catch (error) {
      console.error("Failed to create summary:", error);
      throw new DatabaseError("Database error while creating summary.");
    }
  }

  async findById(id: string): Promise<Summary | null> {
    try {
      const dbSummary = await this.prismaClient.summary.findUnique({
        where: {
          id,
          is_active: true,
        },
      });
      if (!dbSummary) return null;
      const summary = Summary.restore({
        id: dbSummary.id,
        idTopic: dbSummary.id_topic,
        note: Note.restore({ content: dbSummary.note }),
        title: dbSummary.title,
        createdAt: dbSummary.created_at,
        updatedAt: dbSummary.updated_at,
        completedAt: dbSummary.completed_at,
        isActive: dbSummary.is_active || false,
      });
      return summary;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find summary by ID:", error);
      throw new DatabaseError("Database error while retrieving summary.");
    }
  }

  async deactivate(id: string): Promise<void> {
    try {
      const dbSummary = await this.findById(id);
      if (!dbSummary) return;
      const deactivatedSummary = dbSummary.deactivate();
      await this.prismaClient.summary.update({
        where: {
          id: dbSummary.id,
        },
        data: {
          is_active: deactivatedSummary.isActive,
        },
      });
    } catch (error) {
      console.error("Failed to deactivate summary:", error);
      throw new DatabaseError("Database error while deactivating summary.");
    }
  }

  async findByTopic(topicId: string): Promise<Summary | null> {
    try {
      const dbSummary = await this.prismaClient.summary.findFirst({
        where: {
          id_topic: topicId,
          is_active: true,
          topic: {
            is_active: true,
          },
        },
      });

      if (!dbSummary) return null;

      const summary = Summary.restore({
        id: dbSummary.id,
        idTopic: dbSummary.id_topic,
        note: Note.restore({ content: dbSummary.note }),
        title: dbSummary.title,
        createdAt: dbSummary.created_at,
        updatedAt: dbSummary.updated_at,
        completedAt: dbSummary.completed_at,
        isActive: dbSummary.is_active || false,
      });

      return summary;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find summary by topic ID:", error);
      throw new DatabaseError(
        "Database error while retrieving summary by topic."
      );
    }
  }

  async updateTitle(id: string, newTitle: string): Promise<void> {
    try {
      await this.prismaClient.summary.update({
        where: { id },
        data: { title: newTitle },
      });
    } catch (error) {
      console.error("Failed to update title of summary:", error);
      throw new DatabaseError(
        "Database error while updating title of summary."
      );
    }
  }

  async updateContent(id: string, newContent: string): Promise<void> {
    try {
      await this.prismaClient.summary.update({
        where: { id },
        data: { note: newContent },
      });
    } catch (error) {
      console.error("Failed to update contetnt of summary:", error);
      throw new DatabaseError(
        "Database error while updating content of summary."
      );
    }
  }
}
