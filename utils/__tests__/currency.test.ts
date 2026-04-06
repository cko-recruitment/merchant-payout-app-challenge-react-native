import { formatAmount } from '../currency';

describe('formatAmount', () => {
  it('formats GBP amounts correctly', () => {
    expect(formatAmount(100000, 'GBP')).toBe('£1,000.00');
  });

  it('formats EUR amounts correctly', () => {
    expect(formatAmount(100000, 'EUR')).toBe('€1,000.00');
  });

  it('formats pence correctly', () => {
    expect(formatAmount(99, 'GBP')).toBe('£0.99');
  });

  it('formats zero correctly', () => {
    expect(formatAmount(0, 'GBP')).toBe('£0.00');
  });

  it('formats negative amounts with a minus sign', () => {
    expect(formatAmount(-50000, 'GBP')).toBe('£-500.00');
  });

  it('formats large amounts with thousand separators', () => {
    expect(formatAmount(1000000, 'GBP')).toBe('£10,000.00');
  });
});
