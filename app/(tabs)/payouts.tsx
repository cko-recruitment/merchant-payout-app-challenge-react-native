import { zodResolver } from '@hookform/resolvers/zod';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CurrencyPicker } from '@/components/currency-picker';
import { PayoutConfirmationSheet } from '@/components/payout-confirmation-sheet';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PayoutFormValues, payoutSchema } from '@/schemas/payout';
import { formatAmount } from '@/utils/currency';
import { useCreatePayout } from '@/hooks/use-create-payout';
import { addScreenshotListener } from '@/modules/screen-security';

interface ApiError {
  status: number;
}

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

function getErrorMessage(error: unknown): string {
  if (isApiError(error) && error.status === 400) {
    return 'Insufficient funds. Please check your balance and try again.';
  }
  if (isApiError(error) && error.status === 503) {
    return 'Service unavailable. Please try again later.';
  }
  return 'Something went wrong. Please try again.';
}

export default function PayoutsScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<PayoutFormValues>({
    resolver: zodResolver(payoutSchema),
    defaultValues: { currency: 'GBP', iban: '' },
    mode: 'onChange',
  });

  const {
    mutateAsync: submitPayout,
    isPending,
    isSuccess,
    isError,
    error,
    data: payoutResult,
    reset: resetMutation,
  } = useCreatePayout();

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingValues, setPendingValues] = useState<PayoutFormValues | null>(null);

  const isDisabled = !isValid || isPending;

  useEffect(() => {
    const subscription = addScreenshotListener(() => {
      Alert.alert(
        'Security reminder',
        'Please keep your financial information private. Screenshots may contain sensitive information.',
      );
    });

    return () => subscription.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        reset();
        resetMutation();
      };
    }, [reset, resetMutation]),
  );

  const onSubmit = (values: PayoutFormValues) => {
    setPendingValues(values);
    setConfirmVisible(true);
  };

  const handleConfirm = async () => {
    if (!pendingValues) return;
    try {
      await submitPayout({
        amount: Math.round(parseFloat(pendingValues.amount) * 100),
        currency: pendingValues.currency,
        iban: pendingValues.iban,
      });
    } finally {
      setConfirmVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.heading}>
              Send Payout
            </ThemedText>

            <View style={styles.field}>
              <View style={styles.amountRowLabels}>
                <ThemedText type="defaultSemiBold">Amount</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.currencyLabel}>
                  Currency
                </ThemedText>
              </View>
              <View style={styles.amountRow}>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, styles.amountInput, errors.amount && styles.inputError]}
                      placeholder="0.00"
                      keyboardType="decimal-pad"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value?.toString() ?? ''}
                      accessibilityLabel="Payout amount"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="currency"
                  render={({ field: { onChange, value } }) => (
                    <CurrencyPicker value={value} onChange={onChange} />
                  )}
                />
              </View>
              <View style={styles.errorContainer}>
                {errors.amount && (
                  <ThemedText type="caption" style={styles.errorText}>
                    {errors.amount.message}
                  </ThemedText>
                )}
              </View>
            </View>

            <View style={styles.field}>
              <ThemedText type="defaultSemiBold">IBAN</ThemedText>
              <Controller
                control={control}
                name="iban"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.iban && styles.inputError]}
                    placeholder="e.g. GB29NWBK60161331926819"
                    autoCapitalize="characters"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    accessibilityLabel="Destination IBAN"
                  />
                )}
              />
              <View style={styles.errorContainer}>
                {errors.iban && (
                  <ThemedText type="caption" style={styles.errorText}>
                    {errors.iban.message}
                  </ThemedText>
                )}
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                pressed && !isDisabled && styles.submitButtonPressed,
                isDisabled && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isDisabled}
              accessibilityRole="button"
              accessibilityLabel="Confirm payout"
              accessibilityState={{ disabled: isDisabled }}
            >
              <ThemedText type="defaultSemiBold" style={styles.submitButtonText}>
                {isPending ? 'Processing...' : 'Confirm'}
              </ThemedText>
            </Pressable>

            {isSuccess && payoutResult && (
              <View style={styles.successBanner}>
                <ThemedText type="defaultSemiBold" style={styles.successText}>
                  Payout of {formatAmount(payoutResult.amount, payoutResult.currency)} sent
                  successfully.
                </ThemedText>
              </View>
            )}

            {isError && (
              <View style={styles.errorBanner}>
                <ThemedText type="defaultSemiBold" style={styles.errorBannerText}>
                  {getErrorMessage(error)}
                </ThemedText>
              </View>
            )}
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>

      {pendingValues && (
        <PayoutConfirmationSheet
          visible={confirmVisible}
          amount={pendingValues.amount}
          currency={pendingValues.currency}
          iban={pendingValues.iban}
          isSubmitting={isPending}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmVisible(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    marginBottom: 32,
  },
  field: {
    marginBottom: 8,
    gap: 8,
  },
  amountRowLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currencyLabel: {
    width: 100,
    textAlign: 'left',
  },
  amountRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#C0C0C0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  amountInput: {
    flex: 1,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorContainer: {
    height: 18,
    justifyContent: 'center',
  },
  errorText: {
    color: '#EF4444',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonPressed: {
    opacity: 0.8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  successBanner: {
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
  },
  successText: {
    color: '#10B981',
  },
  errorBanner: {
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
  },
  errorBannerText: {
    color: '#EF4444',
  },
});
