export function maskIban(iban: string): string {
  if (iban.length <= 8) return iban;
  const start = iban.slice(0, 4);
  const end = iban.slice(-4);
  const masked = '*'.repeat(iban.length - 8);
  return `${start}${masked}${end}`;
}
