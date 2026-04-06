import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fetchMerchantActivity } from '@/api/merchant';

import { useMerchantActivity } from '@/hooks/use-merchant-activity';

const mockPage1 = {
  items: [
    {
      id: 'act_001',
      type: 'deposit',
      amount: 150000,
      currency: 'GBP',
      date: '2026-04-05T16:54:33.315Z',
      description: 'Payment from Customer ABC',
      status: 'completed',
    },
  ],
  next_cursor: 'cursor_001',
  has_more: true,
};

const mockPage2 = {
  items: [
    {
      id: 'act_002',
      type: 'payout',
      amount: -50000,
      currency: 'GBP',
      date: '2026-04-04T16:54:33.315Z',
      description: 'Payout to Bank Account ****1234',
      status: 'completed',
    },
  ],
  next_cursor: null,
  has_more: false,
};

jest.mock('@/api/merchant', () => ({
  fetchMerchantActivity: jest.fn().mockResolvedValue(mockPage1),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';

  return Wrapper;
};

describe('useMerchantActivity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchMerchantActivity as jest.Mock).mockResolvedValue(mockPage1);
  });

  it('returns loading state initially', () => {
    const { result } = renderHook(() => useMerchantActivity(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it('returns first page of activity on success', async () => {
    const { result } = renderHook(() => useMerchantActivity(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.pages[0]).toEqual(mockPage1);
  });

  it('returns hasNextPage true when has_more is true', async () => {
    const { result } = renderHook(() => useMerchantActivity(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('fetches next page with correct cursor', async () => {
    (fetchMerchantActivity as jest.Mock)
      .mockReset()
      .mockResolvedValueOnce(mockPage1)
      .mockResolvedValueOnce(mockPage2);

    const { result } = renderHook(() => useMerchantActivity(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() => expect(result.current.hasNextPage).toBe(true));

    await act(async () => {
      result.current.fetchNextPage();
    });

    await waitFor(() => expect(result.current.data?.pages.length).toBe(2));
    expect(fetchMerchantActivity).toHaveBeenCalledWith('cursor_001');
  });

  it('returns hasNextPage false when has_more is false', async () => {
    (fetchMerchantActivity as jest.Mock).mockResolvedValueOnce(mockPage2);

    const { result } = renderHook(() => useMerchantActivity(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.hasNextPage).toBe(false);
  });

  it('returns error state on failure', async () => {
    (fetchMerchantActivity as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useMerchantActivity(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(new Error('Network error'));
  });
});
