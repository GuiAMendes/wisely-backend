// Entity
import { Journey } from "../../../../domain/entity/journey/Journey";

// Service
import { PrismaClient } from "../../../../generated/prisma";

// Interface
import type { JourneyGateway } from "../../../../domain/gateway/journey/journey.gateway";

//  Errors
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";
import {
  JourneyType,
} from "../../../../domain/value-object/journey/TypeOfJourney";

export class JourneyRepositoryPrisma implements JourneyGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static with(prismaClient: PrismaClient) {
    return new JourneyRepositoryPrisma(prismaClient);
  }

  async create(journey: Journey): Promise<void> {
    const journeyData = {
      id: journey.id,
      id_directory: journey.idDirectory,
      journey_name: journey.journeyName,
      type_of_journey: journey.typeOfJourney,
      created_at: journey.createdAt,
      updated_at: journey.updatedAt,
      is_completed: journey.isCompleted,
      is_active: journey.isActive,
    };
    try {
      await this.prismaClient.journey.create({
        data: journeyData,
      });
    } catch (error) {
      console.error("Failed to create directory:", error);
      throw new DatabaseError("Database error while creating directory.");
    }
  }

  async findByName(
    idDirectory: string,
    journeyName: string
  ): Promise<Journey[]> {
    try {
      const dbJourneyList = await this.prismaClient.journey.findMany({
        where: {
          id_directory: idDirectory,
          journey_name: {
            contains: journeyName,
          },
          is_active: true,
        },
      });

      if (!dbJourneyList) return [];

      const journeyList = dbJourneyList.map((jour) => {
        const journey = Journey.restore({
          id: jour.id,
          idDirectory: jour.id_directory,
          journeyName: jour.journey_name,
          typeOfJourney: jour.type_of_journey as JourneyType,
          createdAt: jour.created_at,
          updatedAt: jour.updated_at,
          isCompleted: jour.is_completed || false,
          isActive: jour.is_active || false,
        });
        return journey;
      });

      return journeyList;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find directory by name:", error);
      throw new DatabaseError("Database error while retrieving directory.");
    }
  }

  async listAll(idDirectory: string): Promise<Journey[]> {
    try {
      const dbJourneyList = await this.prismaClient.journey.findMany({
        where: {
          id_directory: idDirectory,
          is_active: true,
        },
      });

      if (!dbJourneyList) return [];

      const journeyList = dbJourneyList.map((jour) => {
        const journey = Journey.restore({
          id: jour.id,
          idDirectory: jour.id_directory,
          journeyName: jour.journey_name,
          typeOfJourney: jour.type_of_journey as JourneyType,
          createdAt: jour.created_at,
          updatedAt: jour.updated_at,
          isCompleted: jour.is_completed || false,
          isActive: jour.is_active || false,
        });
        return journey;
      });

      return journeyList;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find directories: ", error);
      throw new DatabaseError("Database error while request directories.");
    }
  }

  async listRecentAccess(idDirectory: string): Promise<Journey[]> {
    try {
      const fiveDaysAgo = new Date();
      const DAYS = 5;
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - DAYS);
      const dbJourneyList = await this.prismaClient.journey.findMany({
        where: {
          id_directory: idDirectory,
          is_active: true,
          updated_at: {
            gte: fiveDaysAgo,
          },
        },
        orderBy: {
          updated_at: "desc",
        },
      });

      if (!dbJourneyList) return [];

      const journeyList = dbJourneyList.map((jour) => {
        const journey = Journey.restore({
          id: jour.id,
          idDirectory: jour.id_directory,
          journeyName: jour.journey_name,
          typeOfJourney: jour.type_of_journey as JourneyType,
          createdAt: jour.created_at,
          updatedAt: jour.updated_at,
          isCompleted: jour.is_completed || false,
          isActive: jour.is_active || false,
        });
        return journey;
      });

      return journeyList;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find directories: ", error);
      throw new DatabaseError("Database error while request directories.");
    }
  }

  async findById(id: string): Promise<Journey | null> {
    try {
      const dbJourney = await this.prismaClient.journey.findUnique({
        where: {
          id,
          is_active: true,
        },
      });

      if (!dbJourney) return null;

      const journey = Journey.restore({
        id: dbJourney.id,
        idDirectory: dbJourney.id_directory,
        journeyName: dbJourney.journey_name,
        typeOfJourney: dbJourney.type_of_journey as JourneyType,
        createdAt: dbJourney.created_at,
        updatedAt: dbJourney.updated_at,
        isCompleted: dbJourney.is_completed || false,
        isActive: dbJourney.is_active || false,
      });

      return journey;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find journey by ID:", error);
      throw new DatabaseError("Database error while retrieving journey.");
    }
  }

  async updateName(id: string, newName: string): Promise<void> {
    try {
      await this.prismaClient.journey.update({
        where: { id },
        data: { journey_name: newName },
      });
    } catch (error) {
      console.error("Failed to update journey:", error);
      throw new DatabaseError("Database error while updating journey.");
    }
  }

  async deactivate(id: string): Promise<void> {
    try {
      const dbJourney = await this.findById(id);

      if (!dbJourney) return;

      const deactivatedJourney = dbJourney.deactivate();

      await this.prismaClient.journey.update({
        where: {
          id: dbJourney.id,
        },
        data: {
          is_active: deactivatedJourney.isActive,
        },
      });
    } catch (error) {
      console.error("Failed to deactivate journey:", error);
      throw new DatabaseError("Database error while deactivating journey.");
    }
  }

  async complete(id: string): Promise<void> {
    try {
      const dbJourney = await this.findById(id);

      if (!dbJourney) return;

      const completedJourney = dbJourney.complete();

      await this.prismaClient.journey.update({
        where: {
          id: dbJourney.id,
        },
        data: {
          is_completed: completedJourney.isCompleted,
        },
      });
    } catch (error) {
      console.error("Failed to complete journey:", error);
      throw new DatabaseError("Database error while completing journey.");
    }
  }

  async updateDateOfAccess(id: string): Promise<void> {
    try {
      const dbJourney = await this.findById(id);

      if (!dbJourney) return;

      const updatedJourney = dbJourney.updateDateOfAccess();

      await this.prismaClient.journey.update({
        where: {
          id: dbJourney.id,
        },
        data: {
          updated_at: updatedJourney.updatedAt,
        },
      });
    } catch (error) {
      console.error("Failed to update date of the Journey:", error);
      throw new DatabaseError(
        "Database error while update date of the Journey."
      );
    }
  }
}
