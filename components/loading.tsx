import { ThemedView } from "@/components/themed-view";
import { ActivityIndicator, StyleSheet } from "react-native";
import { AppColors } from "@/constants/theme";
import { ThemedText } from "./themed-text";
import { useTranslation } from "react-i18next";

interface LoadingProps {
  message?: string;
}

export function Loading({ message = "loading" }: Readonly<LoadingProps>) {
  const { t } = useTranslation();

  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator
        size="large"
        color={AppColors.primary}
        accessibilityRole="progressbar"
        accessibilityLabel={t(message)}
      />
      <ThemedText
        type="subtitle"
        style={styles.message}
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      >
        {t(message)}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  message: {
    color: AppColors.primary,
    marginTop: 16,
  },
});
