import { Dropdown } from "react-native-element-dropdown";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { AppColors } from "@/constants/theme";

interface CurrencyDropdownProps {
  value: string;
  option: any[];
  onChange: (value: string) => void;
}

export function CurrencyDropdown({
  option,
  onChange,
  value,
}: Readonly<CurrencyDropdownProps>) {
  const { t } = useTranslation();
  const [internalValue, setInternalValue] = useState<string | null>(value);
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <View>
      <ThemedText type="defaultSemiBold" style={{ marginBottom: 8 }}>
        {t("payouts.currency")}
      </ThemedText>

      <Dropdown
        style={styles.dropdown}
        data={option}
        labelField="label"
        valueField="value"
        value={internalValue}
        maxHeight={100}
        placeholder={t("payouts.currencyPlaceholder")}
        onChange={(item) => {
          setInternalValue(item.value);
          onChange(item.value);
        }}
        accessibilityLabel={`${t("payouts.currency")}: ${
          internalValue ?? t("payouts.currencyPlaceholder")
        }`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 40,
    borderColor: AppColors.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
});
