import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Currency } from '@/types/api';
import { formatAmount } from '@/utils/currency';
import { maskIban } from '@/utils/iban';

interface PayoutConfirmationSheetProps {
  visible: boolean;
  amount: string;
  currency: Currency;
  iban: string;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PayoutConfirmationSheet({
  visible,
  amount,
  currency,
  iban,
  isSubmitting,
  onConfirm,
  onCancel,
}: PayoutConfirmationSheetProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const amountInPence = Math.round(parseFloat(amount || '0') * 100);
  const backgroundColor = useThemeColor({}, 'background');
  const subtleColor = useThemeColor({ light: '#F0F0F0', dark: '#2A2A2A' }, 'background');

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const handleDismiss = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={['75%']}
      enablePanDownToClose
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={[styles.background, { backgroundColor }]}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Confirm Payout
        </ThemedText>

        <View style={styles.row}>
          <ThemedText style={styles.label}>Amount:</ThemedText>
          <ThemedText type="defaultSemiBold">{formatAmount(amountInPence, currency)}</ThemedText>
        </View>
        <View style={[styles.divider, { backgroundColor: subtleColor }]} />

        <View style={styles.row}>
          <ThemedText style={styles.label}>Currency:</ThemedText>
          <ThemedText type="defaultSemiBold">{currency}</ThemedText>
        </View>
        <View style={[styles.divider, { backgroundColor: subtleColor }]} />

        <View style={styles.row}>
          <ThemedText style={styles.label}>IBAN:</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.iban}>
            {maskIban(iban)}
          </ThemedText>
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              { backgroundColor: subtleColor },
              pressed && styles.buttonPressed,
            ]}
            onPress={onCancel}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Cancel payout"
          >
            <ThemedText type="defaultSemiBold">Cancel</ThemedText>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.confirmButton,
              pressed && styles.buttonPressed,
              isSubmitting && styles.buttonDisabled,
            ]}
            onPress={onConfirm}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Confirm payout"
          >
            <ThemedText type="defaultSemiBold" style={styles.confirmButtonText}>
              {isSubmitting ? 'Processing...' : 'Confirm'}
            </ThemedText>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  indicator: {
    backgroundColor: '#C0C0C0',
    width: 40,
  },
  container: {
    padding: 24,
    paddingBottom: 40,
    gap: 16,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#888',
  },
  iban: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
  },
  divider: {
    height: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
