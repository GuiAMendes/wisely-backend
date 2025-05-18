// Value Object
import { MetaData } from "../../value-object/fileModel/MetaData";

// Types
export type FileModelProps = {
  id: string;
  topicId: string;
  fileName: string;
  fileType: string;
  filePath: MetaData;
  uploadDate: Date | null;
  isActive: boolean;
};

// Interfaces
import { UuidGenerator } from "../../../infra/services/uuid/interfaces/UuidGenerator.interfaces";

export class FileModel {
  private constructor(readonly props: FileModelProps) {}

  public static create(props: {
    topicId: string;
    fileName: string;
    fileType: string;
    base64FileContent: string;
    uuidGenerator: UuidGenerator;
  }) {
    const metaDataBase64 = MetaData.create(props.base64FileContent);

    return new FileModel({
      id: props.uuidGenerator.generate(),
      topicId: props.topicId,
      fileName: props.fileName,
      fileType: props.fileType,
      filePath: metaDataBase64,
      uploadDate: null,
      isActive: true,
    });
  }

  public activate() {
    return new FileModel({
      ...this.props,
      isActive: true,
    });
  }

  public deactivate() {
    return new FileModel({
      ...this.props,
      isActive: false,
    });
  }

  public get id() {
    return this.props.id;
  }

  public get topicId() {
    return this.props.topicId;
  }

  public get fileName() {
    return this.props.fileName;
  }

  public get fileType() {
    return this.props.fileType;
  }

  public get base64Content() {
    return this.props.filePath.encoded;
  }

  public get uploadDate() {
    return this.props.uploadDate;
  }

  public get isActive() {
    return this.props.isActive;
  }
}
