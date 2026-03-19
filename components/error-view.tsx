import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { StyleSheet, View } from "react-native";
import { TCAButton } from "./tca-button";
import { useTranslation } from "react-i18next";
import { AppColors } from "@/constants/theme";

interface ErrorViewProps {
  title: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export function ErrorView({
  title,
  message,
  onRetry,
  retryText,
}: Readonly<ErrorViewProps>) {
  const { t } = useTranslation();

  return (
    <ThemedView
      style={[styles.container, styles.centered]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <View
        style={styles.errorCard}
        accessible={true}
        accessibilityLabel={`${title}. ${message}`}
      >
        <View
          style={styles.errorIconWrap}
          accessibilityElementsHidden={true}
          importantForAccessibility="no-hide-descendants"
        >
          <ThemedText style={styles.errorIcon}>✕</ThemedText>
        </View>
        <ThemedText
          style={styles.errorTitle}
          importantForAccessibility="no-hide-descendants"
        >
          {title}
        </ThemedText>
        <ThemedText
          style={styles.errorMessage}
          importantForAccessibility="no-hide-descendants"
        >
          {message}
        </ThemedText>
      </View>
      {onRetry && (
        <TCAButton
          title={retryText ?? t("payouts.tryAgain")}
          onPress={onRetry}
          isValid={true}
          style={styles.primaryButton}
          accessibilityHint="Retries the failed operation"
        />
      )}
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
  errorCard: {
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
  errorIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,59,48,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  errorIcon: {
    fontSize: 40,
    color: AppColors.error,
    fontWeight: "700",
    lineHeight: 48,
    textAlign: "center",
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: AppColors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  primaryButton: {
    width: "100%",
  },
});
