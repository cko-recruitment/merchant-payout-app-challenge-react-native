import { renderHook, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Alert } from 'react-native';
import React from 'react';

import { useCreatePayout } from '@/hooks/use-create-payout';
import { QUERY_KEYS } from '@/api/query-keys';
import { isBiometricAuthenticated } from '@/modules/screen-security';
import { createPayout } from '@/api/merchant';

jest.mock('@/modules/screen-security', () => ({
  getDeviceId: jest.fn().mockResolvedValue('test-device-id'),
  isBiometricAuthenticated: jest.fn().mockResolvedValue(true),
}));

jest.mock('@/api/merchant', () => ({
  createPayout: jest.fn().mockResolvedValue({
    id: 'payout_123',
    status: 'pending',
    amount: 5000,
    currency: 'GBP',
    iban: 'GB29NWBK60161331926819',
    created_at: '2026-04-06T00:00:00Z',
  }),
}));

jest.spyOn(Alert, 'alert');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';

  return Wrapper;
};

describe('useCreatePayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls createPayout with device_id for amounts under threshold', async () => {
    const { result } = renderHook(() => useCreatePayout(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.mutateAsync({
        amount: 50000,
        currency: 'GBP',
        iban: 'GB29NWBK60161331926819',
      });
    });

    expect(isBiometricAuthenticated).not.toHaveBeenCalled();
    expect(createPayout).toHaveBeenCalledWith({
      amount: 50000,
      currency: 'GBP',
      iban: 'GB29NWBK60161331926819',
      device_id: 'test-device-id',
    });
  });

  it('triggers biometric auth for amounts over threshold', async () => {
    const { result } = renderHook(() => useCreatePayout(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.mutateAsync({
        amount: 150000,
        currency: 'GBP',
        iban: 'GB29NWBK60161331926819',
      });
    });

    expect(isBiometricAuthenticated).toHaveBeenCalled();
    expect(createPayout).toHaveBeenCalled();
  });

  it('aborts payout if biometric auth fails', async () => {
    (isBiometricAuthenticated as jest.Mock).mockResolvedValueOnce(false);

    const { result } = renderHook(() => useCreatePayout(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current
        .mutateAsync({
          amount: 150000,
          currency: 'GBP',
          iban: 'GB29NWBK60161331926819',
        })
        .catch(() => {});
    });

    expect(createPayout).not.toHaveBeenCalled();
  });

  it('shows alert and aborts if biometrics are unavailable', async () => {
    (isBiometricAuthenticated as jest.Mock).mockRejectedValueOnce(
      new Error('BIOMETRIC_UNAVAILABLE'),
    );

    const { result } = renderHook(() => useCreatePayout(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current
        .mutateAsync({
          amount: 150000,
          currency: 'GBP',
          iban: 'GB29NWBK60161331926819',
        })
        .catch(() => {});
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Biometrics Required',
      'Please set up biometrics in your device settings to make payouts over £1,000.',
    );
    expect(createPayout).not.toHaveBeenCalled();
  });

  it('invalidates queries on success', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    Wrapper.displayName = 'TestWrapper';

    const { result } = renderHook(() => useCreatePayout(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        amount: 50000,
        currency: 'GBP',
        iban: 'GB29NWBK60161331926819',
      });
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: QUERY_KEYS.merchant });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: QUERY_KEYS.activity });
  });
});
