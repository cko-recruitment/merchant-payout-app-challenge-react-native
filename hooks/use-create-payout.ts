import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { createPayout } from '@/api/merchant';
import { QUERY_KEYS } from '@/api/query-keys';
import { getDeviceId, isBiometricAuthenticated } from '@/modules/screen-security';
import { CreatePayoutRequest } from '@/types/api';

const BIOMETRIC_THRESHOLD = 100_000;

export function useCreatePayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePayoutRequest) => {
      if (payload.amount >= BIOMETRIC_THRESHOLD) {
        let authenticated: boolean;

        try {
          authenticated = await isBiometricAuthenticated();
        } catch {
          Alert.alert(
            'Biometrics Required',
            'Please set up biometrics in your device settings to make payouts over £1,000.',
          );
          throw new Error('BIOMETRIC_UNAVAILABLE');
        }

        if (!authenticated) {
          throw new Error('BIOMETRIC_FAILED');
        }
      }

      const deviceId = await getDeviceId();
      return createPayout({ ...payload, device_id: deviceId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.merchant });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activity });
    },
  });
}
