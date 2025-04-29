export function isEmpty(value: string): boolean {
  return !value || value.trim() === "";
}

export function hasSQLInjection(value: string): boolean {
  const pattern =
    /('|--|;|\/\*|\*\/|xp_|exec|select|insert|update|delete|drop|union|--)/i;
  return pattern.test(value);
}

export function isSafe(value: string): boolean {
  return !isEmpty(value) && !hasSQLInjection(value);
}

export function ensureSafe(value: string, errorMessage: string): void {
  if (!isSafe(value)) {
    throw new Error(errorMessage);
  }
}
