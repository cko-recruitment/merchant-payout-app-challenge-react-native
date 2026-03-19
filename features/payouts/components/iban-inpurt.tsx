import { TextInput, StyleSheet, View } from "react-native";
import { AppColors } from "@/constants/theme";
import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "react-i18next";

interface IBANInputProps {
  value: string;
  onChange: (text: string) => void;
  error: string | null;
}

export function IBANInput({
  value,
  onChange,
  error,
}: Readonly<IBANInputProps>) {
  const { t } = useTranslation();
  const hasValue = value.length > 0;
  const isValid = hasValue && error === null;

  return (
    <View
      accessible={true}
      accessibilityLabel={`${t("payouts.destinationIban")} input`}
    >
      <ThemedText
        type="defaultSemiBold"
        style={{ marginBottom: 8 }}
        importantForAccessibility="no-hide-descendants"
      >
        {t("payouts.destinationIban")}
      </ThemedText>
      <TextInput
        style={[
          styles.fieldInput,
          isValid && styles.fieldInputFocused,
          error !== null && styles.fieldInputError,
        ]}
        placeholder="e.g. GB29 NWBK 6016 1331 9268 19"
        placeholderTextColor={AppColors.textTertiary}
        value={value}
        onChangeText={onChange}
        autoCapitalize="characters"
        autoCorrect={false}
        testID="iban-input"
        accessibilityLabel={t("payouts.destinationIban")}
        accessibilityHint={t("payouts.ibanHint")}
        accessibilityInvalid={error !== null}
      />
      {error === null ? (
        <ThemedText style={styles.fieldHint} importantForAccessibility="no">
          {t("payouts.ibanHint")}
        </ThemedText>
      ) : (
        <ThemedText
          style={styles.fieldError}
          testID="iban-error"
          // VoiceOver + TalkBack: announce error inline when it appears
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive"
        >
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: AppColors.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  fieldInput: {
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: AppColors.textTertiary,
    borderRadius: 12,
    padding: 14,
    color: AppColors.textPrimary,
    //TODO: backgroundColor: AppColors.surfaceCard,
    letterSpacing: 1,
  },
  fieldInputFocused: {
    borderColor: AppColors.primary,
  },
  fieldInputError: {
    borderColor: AppColors.error,
  },
  fieldHint: {
    marginTop: 6,
    fontSize: 12,
    color: AppColors.textTertiary,
  },
  fieldError: {
    marginTop: 6,
    fontSize: 12,
    color: AppColors.error,
    fontWeight: "500",
  },
});
