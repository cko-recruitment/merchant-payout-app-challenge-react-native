import { TextInput, StyleSheet, View } from "react-native";
import type { Currency } from "@/types/api";
import { AppColors } from "@/constants/theme";
import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "react-i18next";

interface AmountInputProps {
  value: string;
  onChange: (text: string) => void;
  currency: Currency;
  formattedPreview?: string;
}

export function AmountInput({
  value,
  onChange,
  currency,
  formattedPreview,
}: Readonly<AmountInputProps>) {
  const { t } = useTranslation();

  return (
    <View accessible={true} accessibilityLabel={`${t("payouts.amount")} input`}>
      <ThemedText
        type="defaultSemiBold"
        style={{ marginBottom: 8 }}
        importantForAccessibility="no-hide-descendants"
      >
        {t("payouts.amount")}
      </ThemedText>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType="decimal-pad"
        placeholder="0.00"
        returnKeyType="done"
        placeholderTextColor={AppColors.textTertiary}
        testID="amount-input"
        accessibilityLabel={t("payouts.amount")}
        accessibilityHint={
          t("payouts.amountHint") || "Enter the amount to pay out"
        }
      />
      {formattedPreview !== undefined && (
        <ThemedText
          style={styles.formattedPreview}
          accessibilityLabel={`Formatted amount: ${formattedPreview}`}
        >
          {formattedPreview}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    padding: 10,
    borderColor: AppColors.border,
    borderWidth: 1,
    borderRadius: 5,
  },
  formattedPreview: {
    marginTop: 5,
    color: AppColors.textTertiary,
  },
});
