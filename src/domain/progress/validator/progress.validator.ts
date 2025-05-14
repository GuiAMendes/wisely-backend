export class ProgressValidator {
  public static ensureTotalTopicsValid(value: number) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error(
        "O total de tópicos deve ser um número inteiro positivo."
      );
    }
  }

  public static ensureCompletedNotExceedsTotal(
    completed: number,
    total: number
  ) {
    if (completed > total) {
      throw new Error(
        "O número de tópicos concluídos não pode exceder o total."
      );
    }
  }
}
