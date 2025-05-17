// Validators
import { isEmpty, isSafe } from "../../../shared/validators";

// Constants
import { BASE64_REGEX } from "../../constants/fileModel/base64Regex";
import { MAX_BASE64_SIZE } from "../../constants/fileModel/fileModel.constants";

export class MetaDataValidator {
  public static ensureBase64Valid(content: string) {
    if (!isSafe(content)) {
      throw new Error("O conteúdo indicado é inválido ou inseguro.");
    }

    if (!BASE64_REGEX.test(content)) {
      throw new Error(
        "O conteúdo do arquivo deve estar em formato base64 válido."
      );
    }
  }

  public static ensureContentWithinLimit(content: string) {
    if (isEmpty(content)) {
      throw new Error("O conteúdo indicado é inválido ou inseguro.");
    }

    if (content.length > MAX_BASE64_SIZE) {
      throw new Error("O conteúdo do arquivo execede o limite de 5MB.");
    }
  }
}
