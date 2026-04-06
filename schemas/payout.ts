import { z } from 'zod';

export const payoutSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      'Amount must be greater than zero',
    ),
  currency: z.enum(['GBP', 'EUR']),
  iban: z
    .string()
    .min(15, 'IBAN is too short')
    .max(34, 'IBAN is too long')
    .regex(/^[A-Z]{2}[0-9A-Z]+$/, 'Invalid IBAN format'),
});

export type PayoutFormValues = z.infer<typeof payoutSchema>;
