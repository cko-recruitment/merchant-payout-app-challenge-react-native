import { payoutSchema } from '@/schemas/payout';

describe('payoutSchema', () => {
  const validPayload = {
    amount: '100',
    currency: 'GBP' as const,
    iban: 'GB29NWBK60161331926819',
  };

  it('accepts a valid payload', () => {
    expect(payoutSchema.safeParse(validPayload).success).toBe(true);
  });

  it('rejects an empty amount', () => {
    const result = payoutSchema.safeParse({ ...validPayload, amount: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a zero amount', () => {
    const result = payoutSchema.safeParse({ ...validPayload, amount: '0' });
    expect(result.success).toBe(false);
  });

  it('rejects a negative amount', () => {
    const result = payoutSchema.safeParse({ ...validPayload, amount: '-100' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid currency', () => {
    const result = payoutSchema.safeParse({ ...validPayload, currency: 'USD' });
    expect(result.success).toBe(false);
  });

  it('accepts EUR as a valid currency', () => {
    const result = payoutSchema.safeParse({ ...validPayload, currency: 'EUR' });
    expect(result.success).toBe(true);
  });

  it('rejects an IBAN that is too short', () => {
    const result = payoutSchema.safeParse({ ...validPayload, iban: 'GB29' });
    expect(result.success).toBe(false);
  });

  it('rejects an IBAN that is too long', () => {
    const result = payoutSchema.safeParse({ ...validPayload, iban: 'GB29' + 'A'.repeat(35) });
    expect(result.success).toBe(false);
  });

  it('rejects an IBAN with lowercase letters', () => {
    const result = payoutSchema.safeParse({ ...validPayload, iban: 'gb29nwbk60161331926819' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty IBAN', () => {
    const result = payoutSchema.safeParse({ ...validPayload, iban: '' });
    expect(result.success).toBe(false);
  });
});
