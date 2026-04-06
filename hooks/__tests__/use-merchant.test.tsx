import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useMerchant } from '@/hooks/use-merchant';
import { fetchMerchantData } from '@/api/merchant';

jest.mock('@/api/merchant', () => ({
  fetchMerchantData: jest.fn().mockResolvedValue({
    available_balance: 500_000,
    pending_balance: 25_000,
    currency: 'GBP',
    activity: [],
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';

  return Wrapper;
};

describe('useMerchant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns loading state initially', () => {
    const { result } = renderHook(() => useMerchant(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it('returns merchant data on success', async () => {
    const { result } = renderHook(() => useMerchant(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      available_balance: 500_000,
      pending_balance: 25_000,
      currency: 'GBP',
      activity: [],
    });
  });

  it('calls fetchMerchantData', async () => {
    const { result } = renderHook(() => useMerchant(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMerchantData).toHaveBeenCalledTimes(1);
  });

  it('returns error state on failure', async () => {
    (fetchMerchantData as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useMerchant(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(new Error('Network error'));
  });
});
