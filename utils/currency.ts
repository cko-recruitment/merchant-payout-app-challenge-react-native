import { Currency } from '@/types/api';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GBP: '£',
  EUR: '€',
};

export function formatAmount(amountInPence: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const amount = (amountInPence / 100).toFixed(2);
  return `${symbol}${Number(amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
}
