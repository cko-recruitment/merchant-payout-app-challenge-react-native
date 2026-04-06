import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Currency } from '@/types/api';

const CURRENCIES: Currency[] = ['GBP', 'EUR'];

interface CurrencyPickerProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

export function CurrencyPicker({ value, onChange }: CurrencyPickerProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const backgroundColor = useThemeColor({}, 'background');
  const chevronColor = useThemeColor({}, 'icon');
  const selectedOptionColor = useThemeColor({ light: '#EFF6FF', dark: '#1E3A5F' }, 'background');

  const handleOpen = () => bottomSheetRef.current?.present();

  const handleSelect = (currency: Currency) => {
    onChange(currency);
    bottomSheetRef.current?.dismiss();
  };

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
    <>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleOpen}
        accessibilityRole="button"
        accessibilityLabel={`Currency: ${value}. Tap to change`}
      >
        <ThemedText type="defaultSemiBold">{value}</ThemedText>
        <IconSymbol
          name="chevron.right"
          size={14}
          color={chevronColor}
          style={{ transform: [{ rotate: '90deg' }] }}
        />
      </Pressable>

      <BottomSheetModal
        ref={bottomSheetRef}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.background, { backgroundColor }]}
        handleIndicatorStyle={styles.indicator}
      >
        <BottomSheetView style={styles.sheet}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            Select currency
          </ThemedText>
          {CURRENCIES.map((currency) => (
            <View key={currency}>
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                  currency === value && { backgroundColor: selectedOptionColor },
                ]}
                onPress={() => handleSelect(currency)}
                accessibilityRole="button"
                accessibilityLabel={currency}
                accessibilityState={{ selected: currency === value }}
              >
                <ThemedText type="defaultSemiBold">{currency}</ThemedText>
              </Pressable>
            </View>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#C0C0C0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: 100,
    gap: 4,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  background: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  indicator: {
    backgroundColor: '#C0C0C0',
    width: 40,
  },
  sheet: {
    padding: 24,
    paddingBottom: 40,
    gap: 4,
  },
  title: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  optionPressed: {
    opacity: 0.7,
  },
});
