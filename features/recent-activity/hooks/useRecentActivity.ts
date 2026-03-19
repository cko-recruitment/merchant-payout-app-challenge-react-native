import { useInfiniteQuery } from "@tanstack/react-query";
import { merchantService } from "@/services/merchant.service";
import { ActivityItem, PaginatedActivityResponse } from "@/types/api";

export function useRecentActivity() {
  const {
    data,
    isLoading: loading,
    isFetching,
    isFetchingNextPage: loadingMore,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<PaginatedActivityResponse, Error>({
    queryKey: ["reacent-activity"],
    queryFn: ({ pageParam }) =>
      merchantService.getRecentActivity(pageParam as string | null),
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.next_cursor : undefined,
    initialPageParam: null,
  });

  const items: ActivityItem[] = data?.pages.flatMap((p) => p.items) ?? [];

  const fetchMore = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  return {
    items,
    loading,
    loadingMore,
    hasMore: hasNextPage ?? false,
    error: error ? error.message : null,
    fetchMore,
  };
}
