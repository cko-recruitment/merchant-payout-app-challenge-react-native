import { apiClient } from "./api-client";
import { PAGINATION_LIMIT } from "@/constants";
import {
    MerchantDataResponse, 
    MerchantDataResponseSchema,
    PaginatedActivityResponse,
    PaginatedActivityResponseSchema
} from "@/types/api"

export const merchantService = {
    getMerchantData: () : Promise<MerchantDataResponse> =>
        apiClient.get("/api/merchant", MerchantDataResponseSchema),

    getRecentActivity: (cursor?: string | null): Promise<PaginatedActivityResponse> => {
        const params = new URLSearchParams({limit: String(PAGINATION_LIMIT)});
        if (cursor) {
            params.set('cursor', cursor);
        }

        return apiClient.get(`/api/merchant/activity?${params}`, PaginatedActivityResponseSchema);
        
    }
};