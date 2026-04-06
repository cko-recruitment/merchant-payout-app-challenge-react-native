import { useQuery } from '@tanstack/react-query';

import { fetchMerchantData } from '@/api/merchant';
import { QUERY_KEYS } from '@/api/query-keys';

export function useMerchant() {
  return useQuery({
    queryKey: QUERY_KEYS.merchant,
    queryFn: fetchMerchantData,
  });
}
