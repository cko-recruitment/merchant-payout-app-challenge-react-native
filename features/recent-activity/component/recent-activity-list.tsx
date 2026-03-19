import { memo } from "react";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ActivityItem } from "@/types/api";
import { StyleSheet } from "react-native";
import { AppColors, typeColourScheme } from "@/constants/theme";
import { formatedCurrency, formatedDate } from "@/utils";
import { TypeBadge } from "./type-badge";
import { StatusBadge } from "./status-badge";

interface RecentActivityListItemProps {
  item: ActivityItem;
}

export const RecentActivityListItem = memo(function RecentActivityListItem({
  item,
}: Readonly<RecentActivityListItemProps>) {
  const typeColorCode = typeColourScheme(item.type);

  const isPositive = item.amount >= 0;
  const sign = isPositive ? "+" : "";

  const formattedAmount = formatedCurrency(item.amount, item.currency);
  const formattedDate = formatedDate(item.date);

  return (
    <ThemedView
      style={[styles.container, { borderLeftColor: typeColorCode }]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${item.description}, ${sign}${formattedAmount}, ${item.status}, ${formattedDate}`}
    >
      <ThemedView
        style={styles.rowContainer}
        importantForAccessibility="no-hide-descendants"
      >
        <ThemedView>
          <ThemedText style={styles.description} numberOfLines={1}>
            {item.description}
          </ThemedText>
          <ThemedView style={styles.typeBadgeContainer}>
            <TypeBadge type={item.type} />
            <ThemedText style={styles.dateText}>{formattedDate}</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.amountContainer}>
          <ThemedText
            style={[
              styles.amount,
              isPositive ? styles.amountPositive : styles.amountNegative,
            ]}
          >
            {sign}
            {formattedAmount}
          </ThemedText>
          <StatusBadge status={item.status} />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
});

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderLeftWidth: 5,
    marginHorizontal: 8,
    marginVertical: 5,
    borderRadius: 5,
    // Shadow — iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    // Shadow — Android
    elevation: 2,
  },
  rowContainer: {
    flex: 1,
    marginLeft: 5,
    paddingHorizontal: 8,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  description: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: AppColors.textPrimary,
  },
  amountContainer: {
    flex: 1,
    maxWidth: 100,
    alignItems: "flex-end",
    justifyContent: "center",
    marginRight: 5,
  },
  amountPositive: {
    color: AppColors.success,
  },
  amountNegative: {
    color: AppColors.warning,
  },
  dateText: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginLeft: 8,
  },
  typeBadgeContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
