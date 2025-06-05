// Entity
import { FileModel } from "../../../../domain/entity/fileModel/FileModel";

// Value object
import { MetaData } from "../../../../domain/value-object/fileModel/MetaData";

// Service
import { PrismaClient } from "../../../../generated/prisma";

// Interface
import type { FileModelGateway } from "../../../../domain/gateway/fileModel/fileModel.gateway";

//  Errors
import { DatabaseError } from "../../../../presentation/errors/DatabaseError";
import { EntityNotFoundError } from "../../../../presentation/errors/EntityNotFoundError";

export class FileModelRepositoryPrisma implements FileModelGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static with(prismaClient: PrismaClient) {
    return new FileModelRepositoryPrisma(prismaClient);
  }

  async create(fileModel: FileModel): Promise<void> {
    const fileData = {
      id: fileModel.id,
      id_topic: fileModel.topicId,
      file_name: fileModel.fileName,
      file_path: fileModel.base64Content,
      file_type: fileModel.fileType,
      upload_date: fileModel.uploadDate,
      is_active: fileModel.isActive,
    };
    try {
      await this.prismaClient.file_model.create({
        data: fileData,
      });
    } catch (error) {
      console.error("Failed to create file:", error);
      throw new DatabaseError("Database error while creating file.");
    }
  }

  async findById(id: string): Promise<FileModel | null> {
    try {
      const dbFile = await this.prismaClient.file_model.findUnique({
        where: {
          id,
          is_active: true,
        },
      });

      if (!dbFile) return null;

      const file = FileModel.restore({
        id: dbFile.id,
        topicId: dbFile.id_topic,
        fileName: dbFile.file_name,
        filePath: MetaData.create(dbFile.file_path),
        fileType: dbFile.file_type,
        uploadDate: dbFile.upload_date,
        isActive: dbFile.is_active || false,
      });

      return file;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find file by ID:", error);
      throw new DatabaseError("Database error while retrieving file.");
    }
  }

  async deactivate(id: string): Promise<void> {
    try {
      const dbFile = await this.findById(id);

      if (!dbFile) return;

      const deactivateFile = dbFile.deactivate();

      await this.prismaClient.topic.update({
        where: {
          id: dbFile.id,
        },
        data: {
          is_active: deactivateFile.isActive,
        },
      });
    } catch (error) {
      console.error("Failed to deactivate file:", error);
      throw new DatabaseError("Database error while deactivating file.");
    }
  }

  async listAll(idTopic: string): Promise<FileModel[]> {
    try {
      const dbFileList = await this.prismaClient.file_model.findMany({
        where: {
          id_topic: idTopic,
          is_active: true,
        },
      });

      if (!dbFileList) return [];

      const fileList = dbFileList.map((fil) => {
        const file = FileModel.restore({
          id: fil.id,
          topicId: fil.id_topic,
          fileName: fil.file_name,
          filePath: MetaData.create(fil.file_path),
          fileType: fil.file_type,
          uploadDate: fil.upload_date,
          isActive: fil.is_active || false,
        });
        return file;
      });

      return fileList;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      console.error("Failed to find files: ", error);
      throw new DatabaseError("Database error while request files.");
    }
  }
}
