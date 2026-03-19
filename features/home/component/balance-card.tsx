import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { AppColors } from "@/constants/theme";
import { formatedCurrency } from "@/utils";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

interface BalanceCardProps {
  balance: number;
  pendingBalance: number;
  currency?: string;
}

export function BalanceCard({
  balance,
  pendingBalance,
  currency = "GBP",
}: Readonly<BalanceCardProps>) {
  const { t } = useTranslation();
  const tempBalance = formatedCurrency(balance, currency);
  const tempPendingBalance = formatedCurrency(pendingBalance, currency);

  return (
    <ThemedView
      style={styles.card}
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`${t("home.availableBalance")}: ${tempBalance} ${currency}. ${t("home.pending")}: ${tempPendingBalance}`}
    >
      <View
        style={styles.topRow}
        importantForAccessibility="no-hide-descendants"
      >
        <ThemedText style={styles.cardLabel}>
          {t("home.availableBalance")}
        </ThemedText>
        <View style={styles.currencyBadge}>
          <ThemedText style={styles.currencyText}>{currency}</ThemedText>
        </View>
      </View>

      <ThemedText type="header" importantForAccessibility="no-hide-descendants">
        {tempBalance}
      </ThemedText>

      <View
        style={styles.divider}
        importantForAccessibility="no-hide-descendants"
      />

      <View
        style={styles.bottomRow}
        importantForAccessibility="no-hide-descendants"
      >
        <ThemedText style={styles.pendingLabel}>{t("home.pending")}</ThemedText>
        <ThemedText style={styles.pendingAmount}>
          {tempPendingBalance}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 180,
    marginHorizontal: 16,
    marginBottom: 28,
    backgroundColor: AppColors.primary,
    borderRadius: 16,
    padding: 24,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  currencyBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  currencyText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginTop: 24,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginVertical: 12,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pendingLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pendingAmount: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
