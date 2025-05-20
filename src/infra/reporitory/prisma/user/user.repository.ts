// Entity
import { User } from "../../../../domain/entity/user/User";

// Value object
import { Email } from "../../../../domain/value-object/user/Email";
import { Password } from "../../../../domain/value-object/user/Password";

// Service
import { PrismaClient } from "../../../../generated/prisma";

// Interface
import { UserGateway } from "../../../../domain/gateway/user/user.gateway";

//  Errors
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";

export class UserRepositoryPrisma implements UserGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static with(prismaClient: PrismaClient) {
    return new UserRepositoryPrisma(prismaClient);
  }

  async create(user: User): Promise<void> {
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      user_password: user.passwordHash,
      is_active: user.isActive,
    };

    try {
      await this.prismaClient.user.create({ data: userData });
    } catch (error) {
      console.error("Failed to create user:", error);
      throw new DatabaseError("Database error while creating user.");
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const dbUser = await this.prismaClient.user.findUnique({
        where: {
          id,
          is_active: true,
        },
      });

      if (!dbUser) return null;

      const user = User.restore({
        id: dbUser.id,
        username: dbUser.username,
        email: Email.restore({ address: dbUser.email }),
        password: Password.restore({ hashPassword: dbUser.user_password }),
        isActive: dbUser.is_active || false,
      });

      return user;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find user by ID:", error);
      throw new DatabaseError("Database error while retrieving user.");
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const dbUser = await this.prismaClient.user.findUnique({
        where: {
          email,
          is_active: true,
        },
      });

      if (!dbUser) return null;

      const user = User.restore({
        id: dbUser.id,
        username: dbUser.username,
        email: Email.restore({ address: dbUser.email }),
        password: Password.restore({ hashPassword: dbUser.user_password }),
        isActive: dbUser.is_active || false,
      });

      return user;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find user by email:", error);
      throw new DatabaseError("Database error while retrieving user.");
    }
  }

  async update(user: User): Promise<void> {
    try {
      await this.prismaClient.user.update({
        where: { id: user.id },
        data: { username: user.username },
      });
    } catch (error) {
      console.error("Failed to update user:", error);
      throw new DatabaseError("Database error while updating user.");
    }
  }

  async deactivate(id: string): Promise<void> {
    try {
      const dbUser = await this.findById(id);

      if (!dbUser) return;

      const deactivatedUser = dbUser.deactivate();

      await this.prismaClient.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          is_active: deactivatedUser.isActive,
        },
      });
    } catch (error) {
      console.error("Failed to deactivate user:", error);
      throw new DatabaseError("Database error while deactivating user.");
    }
  }
}
