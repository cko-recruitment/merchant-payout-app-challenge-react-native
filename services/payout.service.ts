import { apiClient } from "./api-client";
import { PayoutResponseSchema } from "@/types/api";
import type { CreatePayoutRequest, PayoutResponse } from "@/types/api";

export const payoutService = {
  createPayout: (payload: CreatePayoutRequest): Promise<PayoutResponse> =>
    apiClient.post("/api/payouts", payload, PayoutResponseSchema),
};
