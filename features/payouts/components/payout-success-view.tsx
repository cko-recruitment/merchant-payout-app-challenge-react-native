import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TCAButton } from "@/components/tca-button";
import { formatedCurrency } from "@/utils";
import { AppColors } from "@/constants/theme";
import type { Currency } from "@/types/api";

interface PayoutSuccessViewProps {
  amount: number;
  currency: Currency;
  iban: string;
  onNewPayout: () => void;
}

/**
 * S — Single Responsibility: only renders the post-payout success state.
 */
export function PayoutSuccessView({
  amount,
  currency,
  iban,
  onNewPayout,
}: Readonly<PayoutSuccessViewProps>) {
  const { t } = useTranslation();

  const formattedAmount = formatedCurrency(amount, currency);

  return (
    <ThemedView style={[styles.container, styles.centered]}>
      <View
        style={styles.successCard}
        accessible
        accessibilityRole="summary"
        accessibilityLabel={`Payout sent successfully. Amount: ${formattedAmount}. To IBAN ending ${iban.slice(-4)}`}
      >
        <View
          style={styles.successIconWrap}
          // Decorative — screen reader reads the card label above
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <ThemedText style={styles.successIcon}>✓</ThemedText>
        </View>
        <ThemedText style={styles.successTitle}>
          {t("payouts.payoutSent")}
        </ThemedText>
        <ThemedText style={styles.successAmount} type="defaultSemiBold">
          {formattedAmount}
        </ThemedText>
        <ThemedText style={styles.successIban} numberOfLines={1}>
          {iban}
        </ThemedText>
      </View>
      <TCAButton
        title={t("payouts.newPayout")}
        onPress={onNewPayout}
        isValid={true}
        testID="new-payout-button"
        accessibilityHint="Clears the form so you can start a new payout"
        style={styles.actionButton}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successCard: {
    backgroundColor: AppColors.surfaceCard,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  successIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(52,199,89,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 40,
    color: AppColors.success,
    fontWeight: "700",
    lineHeight: 48,
    textAlign: "center",
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  successAmount: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 12,
    letterSpacing: -0.5,
    textAlign: "center",
    lineHeight: 38,
  },
  successIban: {
    fontSize: 14,
    color: AppColors.textSecondary,
    fontFamily: "monospace",
    letterSpacing: 0.5,
    marginTop: 12,
    opacity: 0.8,
    textAlign: "center",
    width: "100%",
  },
  actionButton: {
    width: "100%",
  },
});
