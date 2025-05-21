// Entity
import { Directory } from "../../../../domain/entity/directory/Directory";

// Service
import { PrismaClient } from "../../../../generated/prisma";

// Interface
import type { DirectoryGateway } from "../../../../domain/gateway/directory/directory.gateway";

//  Errors
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class DirectoryRepositoryPrisma implements DirectoryGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static with(prismaClient: PrismaClient) {
    return new DirectoryRepositoryPrisma(prismaClient);
  }

  async create(directory: Directory): Promise<void> {
    const directoryData = {
      id: directory.id,
      id_user: directory.idUser,
      directory_name: directory.directoryName,
      is_completed: directory.isCompleted,
      is_active: directory.isActive,
      is_template: directory.isTemplate,
    };
    try {
      await this.prismaClient.directory.create({
        data: directoryData,
      });
    } catch (error) {
      console.error("Failed to create directory:", error);
      throw new DatabaseError("Database error while creating directory.");
    }
  }

  async findByName(
    idUser: string,
    directoryName: string
  ): Promise<Directory[]> {
    try {
      const dbDirectoryList = await this.prismaClient.directory.findMany({
        where: {
          id_user: idUser,
          directory_name: directoryName,
          is_active: true,
        },
      });

      if (!dbDirectoryList) return [];

      const directoryList = dbDirectoryList.map((dir) => {
        const directory = Directory.restore({
          id: dir.id,
          idUser: dir.id_user,
          directoryName: dir.directory_name,
          createdAt: dir.created_at,
          updatedAt: dir.updated_at,
          isCompleted: dir.is_completed || false,
          isActive: dir.is_active || true,
          isTemplate: dir.is_template || false,
        });
        return directory;
      });

      return directoryList;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find directory by name:", error);
      throw new DatabaseError("Database error while retrieving directory.");
    }
  }

  async listAll(idUser: string): Promise<Directory[]> {
    try {
      const dbDirectoryList = await this.prismaClient.directory.findMany({
        where: {
          id_user: idUser,
          is_active: true,
        },
      });

      if (!dbDirectoryList) return [];

      const directoryList = dbDirectoryList.map((dir) => {
        const directory = Directory.restore({
          id: dir.id,
          idUser: dir.id_user,
          directoryName: dir.directory_name,
          createdAt: dir.created_at,
          updatedAt: dir.updated_at,
          isCompleted: dir.is_completed || false,
          isActive: dir.is_active || true,
          isTemplate: dir.is_template || false,
        });
        return directory;
      });

      return directoryList;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find directories: ", error);
      throw new DatabaseError("Database error while request directories.");
    }
  }

  async listRecentAccess(idUser: string): Promise<Directory[]> {
    try {
      const fiveDaysAgo = new Date();
      const DAYS = 5;
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - DAYS);
      const dbDirectoryList = await this.prismaClient.directory.findMany({
        where: {
          id_user: idUser,
          is_active: true,
          updated_at: {
            gte: fiveDaysAgo,
          },
        },
        orderBy: {
          updated_at: "desc",
        },
      });

      if (!dbDirectoryList) return [];

      const directoryList = dbDirectoryList.map((dir) => {
        const directory = Directory.restore({
          id: dir.id,
          idUser: dir.id_user,
          directoryName: dir.directory_name,
          createdAt: dir.created_at,
          updatedAt: dir.updated_at,
          isCompleted: dir.is_completed || false,
          isActive: dir.is_active || true,
          isTemplate: dir.is_template || false,
        });
        return directory;
      });

      return directoryList;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find directories: ", error);
      throw new DatabaseError("Database error while request directories.");
    }
  }

  async findById(id: string): Promise<Directory | null> {
    try {
      const dbDirectory = await this.prismaClient.directory.findUnique({
        where: {
          id,
          is_active: true,
        },
      });

      if (!dbDirectory) return null;

      const directory = Directory.restore({
        id: dbDirectory.id,
        idUser: dbDirectory.id_user,
        directoryName: dbDirectory.directory_name,
        createdAt: dbDirectory.created_at,
        updatedAt: dbDirectory.updated_at,
        isCompleted: dbDirectory.is_completed || false,
        isActive: dbDirectory.is_active || true,
        isTemplate: dbDirectory.is_template || false,
      });

      return directory;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find directory by ID:", error);
      throw new DatabaseError("Database error while retrieving directory.");
    }
  }

  async updateName(id: string, newName: string): Promise<void> {
    try {
      await this.prismaClient.directory.update({
        where: { id },
        data: { directory_name: newName },
      });
    } catch (error) {
      console.error("Failed to update directory:", error);
      throw new DatabaseError("Database error while updating directory.");
    }
  }

  async deactivate(id: string): Promise<void> {
    try {
      const dbDirectory = await this.findById(id);

      if (!dbDirectory) return;

      const deactivatedUser = dbDirectory.deactivate();

      await this.prismaClient.directory.update({
        where: {
          id: dbDirectory.id,
        },
        data: {
          is_active: deactivatedUser.isActive,
        },
      });
    } catch (error) {
      console.error("Failed to deactivate directory:", error);
      throw new DatabaseError("Database error while deactivating directory.");
    }
  }

  async complete(id: string): Promise<void> {
    try {
      const dbDirectory = await this.findById(id);

      if (!dbDirectory) return;

      const completedDirectory = dbDirectory.complete();

      await this.prismaClient.directory.update({
        where: {
          id: dbDirectory.id,
        },
        data: {
          is_completed: completedDirectory.isCompleted,
        },
      });
    } catch (error) {
      console.error("Failed to complete directory:", error);
      throw new DatabaseError("Database error while completing directory.");
    }
  }

  async updateDateOfAccess(id: string): Promise<void> {
    try {
      const dbDirectory = await this.findById(id);

      if (!dbDirectory) return;

      const updatedDirectory = dbDirectory.updateDateOfAccess();

      await this.prismaClient.directory.update({
        where: {
          id: dbDirectory.id,
        },
        data: {
          updated_at: updatedDirectory.updatedAt,
        },
      });
    } catch (error) {
      console.error("Failed to update date of the directory:", error);
      throw new DatabaseError(
        "Database error while update date of the directory."
      );
    }
  }
}
