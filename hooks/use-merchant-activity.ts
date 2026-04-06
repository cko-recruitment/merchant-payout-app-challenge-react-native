import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchMerchantActivity } from '@/api/merchant';
import { QUERY_KEYS } from '@/api/query-keys';

export function useMerchantActivity() {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.activity,
    queryFn: ({ pageParam }) => fetchMerchantActivity(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? (lastPage.next_cursor ?? undefined) : undefined,
  });
}
