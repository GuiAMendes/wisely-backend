// Validator
import { MetaDataValidator } from "../../validator/fileModel/MetaData.validator";

// Types
export interface MetaDataProps {
  encoded: string;
}

export class MetaData {
  private constructor(public readonly props: MetaDataProps) {}

  public static create(encoded: string): MetaData {
    MetaDataValidator.ensureContentWithinLimit(encoded);
    MetaDataValidator.ensureBase64Valid(encoded);
    return new MetaData({ encoded: encoded });
  }

  public static restore(props: MetaDataProps) {
    return new MetaData({
      encoded: props.encoded,
    });
  }

  public get encoded() {
    return this.props.encoded;
  }

  public equals(other: MetaData) {
    return this.encoded === other.encoded;
  }
}
