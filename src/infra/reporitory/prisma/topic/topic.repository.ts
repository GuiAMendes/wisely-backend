// Entity
import { Topic } from "../../../../domain/entity/topic/Topic";

// Service
import { PrismaClient } from "../../../../generated/prisma";

// Interface
import type { TopicGateway } from "../../../../domain/gateway/topic/topic.gateway";

//  Errors
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class TopicRepositoryPrisma implements TopicGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static with(prismaClient: PrismaClient) {
    return new TopicRepositoryPrisma(prismaClient);
  }

  async create(topic: Topic): Promise<void> {
    const topicData = {
      id: topic.id,
      id_journey: topic.idJourney,
      topic_name: topic.topicName,
      completed_at: topic.completedAt,
      is_concluded: topic.isConcluded,
      is_active: topic.isActive,
    };
    try {
      await this.prismaClient.topic.create({
        data: topicData,
      });
    } catch (error) {
      console.error("Failed to create topic:", error);
      throw new DatabaseError("Database error while creating topic.");
    }
  }

  async listAll(idJourney: string): Promise<Topic[]> {
    try {
      const dbTopicList = await this.prismaClient.topic.findMany({
        where: {
          id_journey: idJourney,
          journey: {
            is_active: true,
          },
        },
        orderBy: {
          created_at: "asc",
        },
      });

      if (!dbTopicList) return [];

      const topicList = dbTopicList.map((top) => {
        const topic = Topic.restore({
          id: top.id,
          idJourney: top.id_journey,
          topicName: top.topic_name,
          createdAt: top.created_at,
          isConcluded: top.is_concluded || false,
          completedAt: top.completed_at,
          updatedAt: top.updated_at,
          isActive: top.is_active || false,
        });
        return topic;
      });

      return topicList;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find topics: ", error);
      throw new DatabaseError("Database error while request topics.");
    }
  }

  async findByName(idJourney: string, topicName: string): Promise<Topic[]> {
    try {
      const dbTopicList = await this.prismaClient.topic.findMany({
        where: {
          id_journey: idJourney,
          topic_name: {
            contains: topicName,
          },
          journey: {
            is_active: true,
          },
        },
        orderBy: {
          created_at: "asc",
        },
      });

      if (!dbTopicList) return [];

      const topicList = dbTopicList.map((top) => {
        const topic = Topic.restore({
          id: top.id,
          idJourney: top.id_journey,
          topicName: top.topic_name,
          createdAt: top.created_at,
          isConcluded: top.is_concluded || false,
          completedAt: top.completed_at,
          updatedAt: top.updated_at,
          isActive: top.is_active || false,
        });
        return topic;
      });

      return topicList;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find topic by name:", error);
      throw new DatabaseError("Database error while retrieving topic.");
    }
  }

  async findById(id: string): Promise<Topic | null> {
    try {
      const dbTopic = await this.prismaClient.topic.findUnique({
        where: {
          id,
          is_active: true,
        },
      });

      if (!dbTopic) return null;

      const topic = Topic.restore({
        id: dbTopic.id,
        idJourney: dbTopic.id_journey,
        topicName: dbTopic.topic_name,
        createdAt: dbTopic.created_at,
        isConcluded: dbTopic.is_concluded || false,
        completedAt: dbTopic.completed_at,
        updatedAt: dbTopic.updated_at,
        isActive: dbTopic.is_active || false,
      });

      return topic;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find directory by ID:", error);
      throw new DatabaseError("Database error while retrieving directory.");
    }
  }

  async complete(id: string): Promise<void> {
    try {
      const dbTopic = await this.findById(id);

      if (!dbTopic) return;

      const completedTopic = dbTopic.complete();

      await this.prismaClient.topic.update({
        where: {
          id: dbTopic.id,
        },
        data: {
          is_concluded: completedTopic.isConcluded,
        },
      });
    } catch (error) {
      console.error("Failed to complete topic:", error);
      throw new DatabaseError("Database error while completing topic.");
    }
  }

  async deactivate(id: string): Promise<void> {
    try {
      const dbtopic = await this.findById(id);

      if (!dbtopic) return;

      const deactivateTopic = dbtopic.deactivate();

      await this.prismaClient.topic.update({
        where: {
          id: dbtopic.id,
        },
        data: {
          is_active: deactivateTopic.isActive,
        },
      });
    } catch (error) {
      console.error("Failed to deactivate topic:", error);
      throw new DatabaseError("Database error while deactivating topic.");
    }
  }

  async updateName(id: string, newName: string): Promise<void> {
    try {
      await this.prismaClient.topic.update({
        where: { id },
        data: { topic_name: newName },
      });
    } catch (error) {
      console.error("Failed to update topic:", error);
      throw new DatabaseError("Database error while updating topic.");
    }
  }
}
