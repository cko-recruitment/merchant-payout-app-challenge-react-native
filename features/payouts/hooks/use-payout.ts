import { useEffect } from "react";
import { Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import ScreenSecurity from "@/modules/screen-security";
import { payoutService } from "@/services/payout.service";
import { BIOMETRIC_THRESHOLD } from "@/constants";
import { formatedCurrency } from "@/utils";
import type { PayoutResponse, Currency } from "@/types/api";

export function usePayout() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = ScreenSecurity.addListener("onScreenshotTaken", () => {
      Alert.alert(
        "Security Warning",
        "You have taken a screenshot. Please keep your financial data safe and private.",
      );
    });
    return () => subscription.remove();
  }, []);

  const mutation = useMutation<
    PayoutResponse,
    Error,
    Parameters<typeof payoutService.createPayout>[0]
  >({
    mutationFn: payoutService.createPayout,
    onSuccess: () => {
      // Invalidate the ['merchant'] cache so HomeScreen balance refetches automatically.
      queryClient.invalidateQueries({ queryKey: ["merchant"] });
    },
  });

  const submitPayout = async (
    amount: number,
    currency: Currency,
    iban: string,
  ): Promise<PayoutResponse | null> => {
    try {
      if (amount >= BIOMETRIC_THRESHOLD) {
        const isAuth = await ScreenSecurity.isBiometricAuthenticated().catch(
          () => false,
        );
        if (!isAuth) {
          Alert.alert(
            "Authentication Failed",
            `Biometric authentication is required for payouts of ${formatedCurrency(
              BIOMETRIC_THRESHOLD * 100,
              currency,
            )} or more. Please set up biometrics in your device settings to proceed.`,
          );
          return null;
        }
      }

      const amountInLowestDenomination = Math.round(amount * 100);
      const deviceId = ScreenSecurity.getDeviceId();

      return await mutation.mutateAsync({
        amount: amountInLowestDenomination,
        currency,
        iban: iban.trim(),
        device_id: deviceId,
      });
    } catch (err) {
      throw err;
    }
  };

  return {
    isLoading: mutation.isPending,
    error: mutation.error,
    submitPayout,
    reset: mutation.reset,
  };
}
