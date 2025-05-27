// Service
import { PrismaClient } from "../../../../generated/prisma";

// Interface
import { SettingsGateway } from "../../../../domain/gateway/settings/settings.gateway";

//  Errors
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";

export class SettingsRepositoryPrisma implements SettingsGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static with(prismaClient: PrismaClient) {
    return new SettingsRepositoryPrisma(prismaClient);
  }

  async create(idUser: string): Promise<void> {
    try {
      await this.prismaClient.settings.create({
        data: {
          id_user: idUser,
        },
      });
    } catch (error) {
      console.error("Failed to create settings from user:", error);
      throw new DatabaseError(
        "Database error while creating settings from user."
      );
    }
  }

  async updateColorSchema(
    idUser: string,
    newColorSchema: string
  ): Promise<void> {
    try {
      await this.prismaClient.settings.update({
        where: {
          id_user: idUser,
        },
        data: { colorSchema: newColorSchema },
      });
    } catch (error) {
      console.error("Failed to update user settings:", error);
      throw new DatabaseError("Database error while updating user settings.");
    }
  }

  async findByIdUser(idUser: string): Promise<string | null> {
    try {
      const dbUser = await this.prismaClient.user.findUnique({
        where: {
          id: idUser,
          is_active: true,
        },
      });
      if (!dbUser) return null;

      const dbSetting = await this.prismaClient.settings.findUnique({
        where: {
          id_user: idUser,
        },
      });

      if (!dbSetting) return null;

      return dbSetting.colorSchema;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find user by ID:", error);
      throw new DatabaseError("Database error while retrieving user settings.");
    }
  }
}
