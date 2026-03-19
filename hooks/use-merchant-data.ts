import { useQuery } from "@tanstack/react-query";
import { merchantService } from "@/services/merchant.service";
import { MerchantDataResponse } from "@/types/api";

export function useMerchantData() {
  const { data, isLoading: loading, error, refetch } = useQuery<MerchantDataResponse, Error>({
    queryKey: ['merchant'],
    queryFn: merchantService.getMerchantData,
  });

  return {
    data: data ?? null,
    loading,
    error: error ? error.message : null,
    refetch,
  };
}
