/**
 * API Type Definitions
 */

//export type PayoutStatus = "pending" | "processing" | "completed" | "failed";

//export type Currency = 'GBP' | 'EUR';

export type ActivityType = "payout" | "deposit" | "refund" | "fee";

export type ActivityStatus = "completed" | "pending" | "processing" | "failed";

export interface BalanceResponse {
  available_balance: number; // in lowest denomination of the currency
  pending_balance: number; // in lowest denomination of the currency
  currency: Currency;
}

export interface MerchantDataResponse {
  available_balance: number; // in lowest denomination of the currency
  pending_balance: number; // in lowest denomination of the currency
  currency: Currency;
  activity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  amount: number; // in lowest denomination of the currency
  currency: Currency;
  date: string;
  description: string;
  status: ActivityStatus;
}

//TODO: Need to remove these codes
// export interface PaginatedActivityResponse {
//   items: ActivityItem[];
//   next_cursor: string | null; // null when no more items
//   has_more: boolean;
// }

export type ActivityResponse = ActivityItem[];

export interface CreatePayoutRequest {
  amount: number; // in lowest denomination of the currency
  currency: Currency;
  iban: string;
  device_id?: string;
}

export interface PayoutResponse {
  id: string;
  status: PayoutStatus;
  amount: number; // in lowest denomination of the currency
  currency: Currency;
  iban: string;
  created_at: string;
}

//TODO: Need to add zod schema for all the above types and use it in api client for type safety and validation
import { z } from "zod";

export const CurrencySchema = z.enum(["GBP", "EUR"]);
export const PayoutStatusSchema = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const ActivityTypeSchema = z.enum([
  "payout",
  "deposit",
  "refund",
  "fee",
]);
export const ActivityStatusSchema = z.enum([
  "completed",
  "pending",
  "processing",
  "failed",
]);

export const ActivityItemSchema = z.object({
  id: z.string(),
  type: ActivityTypeSchema,
  amount: z.number().int(),
  currency: CurrencySchema,
  date: z.iso.datetime(),
  description: z.string(),
  status: ActivityStatusSchema,
});

export const MerchantDataResponseSchema = z.object({
  available_balance: z.number().int(),
  pending_balance: z.number().int(), // in lowest denomination of the currency
  currency: CurrencySchema,
  activity: z.array(ActivityItemSchema),
});

export const PaginatedActivityResponseSchema = z.object({
  items: z.array(ActivityItemSchema),
  next_cursor: z.string().nullable(),
  has_more: z.boolean(),
});

export const PayoutResponseSchema = z.object({
  id: z.string(),
  status: PayoutStatusSchema,
  amount: z.number().int(),
  currency: CurrencySchema,
  iban: z.string(),
  created_at: z.iso.datetime(),
});

/**
 * IBAN validation: 15–34 chars, starts with 2 uppercase letters + 2 digits.
 * Used in both the payout form and CreatePayoutRequest schema.
 */
export const IbanSchema = z
  .string()
  .min(15, "IBAN is too short (minimum 15 characters)")
  .max(34, "IBAN is too long (maximum 34 characters)")
  .regex(
    /^[A-Z]{2}\d{2}/,
    "IBAN must start with 2 letters followed by 2 digits",
  );

export type PaginatedActivityResponse = z.infer<
  typeof PaginatedActivityResponseSchema
>;
export type Currency = z.infer<typeof CurrencySchema>;
export type PayoutStatus = z.infer<typeof PayoutStatusSchema>;
