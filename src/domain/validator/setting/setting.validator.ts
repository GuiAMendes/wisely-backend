import { ensureSafe } from "../../../shared/validators";

export class SettingValidator {
  public static isHexColor(value: string) {
    ensureSafe(value, "Valor inseguro ou inválido para hexadecimal.");
    return /^#?[0-9A-Fa-f]{6}$/.test(value) || /^#?[0-9A-Fa-f]{3}$/.test(value);
  }
}
