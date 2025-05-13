// Validators
import { isEmpty, isSafe } from "../../../shared/validators";

// Constants
import { MAX_BASE64_SIZE } from "../constants";

export class MetaDataValidator {
  public static ensureBase64Valid(content: string) {
    if (!isSafe(content))
      throw new Error("O conteúdo indicado é inválido ou inseguro.");

    const base64Regex =
      /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=)?$/i;

    if (!base64Regex.test(content)) {
      throw new Error(
        "O conteúdo do arquivo deve estar em formato base64 válido."
      );
    }
  }

  public static ensureContentWithinLimit(content: string) {
    if (isEmpty(content))
      throw new Error("O conteúdo indicado é inválido ou inseguro.");

    if (content.length > MAX_BASE64_SIZE)
      throw new Error("O conteúdo do arquivo execede o limite de 5MB.");
  }
}
