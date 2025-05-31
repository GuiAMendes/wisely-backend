// Service
import { PrismaClient } from "../../../../generated/prisma";

// Interface
import type {
  ProgressGateway,
  ResumeStatistics,
} from "../../../../domain/gateway/progress/progress.gateway";

//  Errors
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { Progress } from "../../../../domain/entity/progress/Progress";

export class ProgressRepositoryPrisma implements ProgressGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static with(prismaClient: PrismaClient) {
    return new ProgressRepositoryPrisma(prismaClient);
  }

  async create(journeyId: string): Promise<void> {
    try {
      const progress = Progress.create({ journeyId: journeyId });
      await this.prismaClient.progress.create({
        data: {
          id_journey: progress.journeyId,
          total_topics: progress.totalTopics,
        },
      });
    } catch (error) {
      console.error("Failed to create progress of journey:", error);
      throw new DatabaseError(
        "Database error while creating progress of journey."
      );
    }
  }

  async findByJourney(journeyId: string): Promise<Progress | null> {
    try {
      const dbProgress = await this.prismaClient.progress.findUnique({
        where: {
          id_journey: journeyId,
          is_active: true,
        },
      });

      if (!dbProgress) return null;

      const progress = Progress.restore({
        journeyId: dbProgress.id_journey,
        completedTopics: dbProgress.completed_topics || 0,
        totalTopics: dbProgress.total_topics,
        updatedAt: dbProgress.updated_at,
        isActive: dbProgress.is_active || false,
      });

      return progress;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find progress by journey:", error);
      throw new DatabaseError("Database error while retrieving progress.");
    }
  }

  async increaseCompleted(journeyId: string): Promise<void> {
    try {
      const dbProgress = await this.findByJourney(journeyId);

      if (!dbProgress) return;

      const increasedProgress = dbProgress.updateCompletedTopics();

      await this.prismaClient.progress.update({
        where: {
          id_journey: increasedProgress.journeyId,
        },
        data: {
          completed_topics: increasedProgress.completedTopics,
        },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find progress by journey:", error);
      throw new DatabaseError("Database error while retrieving progress.");
    }
  }

  async resumeStatistics(idUser: string): Promise<ResumeStatistics> {
    try {
      const progresses = await this.prismaClient.progress.findMany({
        where: {
          is_active: true,
          journey: {
            directory: {
              user: {
                id: idUser,
              },
            },
          },
        },
        include: {
          journey: true,
        },
      });

      const totalJourneys = progresses.length;
      const completedJourneys = progresses.filter(
        (p) => p.total_topics > 0 && p.completed_topics === p.total_topics
      ).length;

      const totalTopics = progresses.reduce(
        (acc, p) => acc + p.total_topics,
        0
      );
      const completedTopics = progresses.reduce(
        (acc, p) => acc + (p.completed_topics || 0),
        0
      );

      const completionPercentage =
        totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

      const journeysProgress = progresses.map((p) => ({
        journeyName: p.journey?.journey_name || "",
        completedTopics: p.completed_topics || 0,
        totalTopics: p.total_topics,
        completionPercentage:
          p.total_topics > 0
            ? ((p.completed_topics || 0) / p.total_topics) * 100
            : 0,
      }));

      return {
        totalJourneys,
        completedJourneys,
        totalTopics,
        completedTopics,
        completionPercentage: parseFloat(completionPercentage.toFixed(2)),
        journeysProgress,
      };
    } catch (error) {
      console.error("Failed to generate resume statistics:", error);
      throw new DatabaseError(
        "Database error while generating resume statistics."
      );
    }
  }
}
