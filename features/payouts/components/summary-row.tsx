import React from "react";
import { StyleSheet, View, type StyleProp, type TextStyle } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { AppColors } from "@/constants/theme";

interface SummaryRowProps {
  label: string;
  value: string;
  valueStyle?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

export function SummaryRow({
  label,
  value,
  valueStyle,
  numberOfLines,
}: Readonly<SummaryRowProps>) {
  return (
    <View
      style={styles.summaryRow}
      accessible={true}
      accessibilityLabel={`${label}: ${value}`}
    >
      <ThemedText style={styles.summaryLabel}>{label}</ThemedText>
      <ThemedText
        style={[styles.summaryValue, valueStyle]}
        numberOfLines={numberOfLines}
      >
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  summaryLabel: {
    color: AppColors.textSecondary,
    fontSize: 14,
  },
  summaryValue: {
    fontWeight: "600",
    fontSize: 14,
    maxWidth: "60%",
    textAlign: "right",
  },
});
