import {
  Pressable,
  StyleSheet,
  type AccessibilityState,
  type ViewStyle,
  type StyleProp,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { AppColors } from "@/constants/theme";

/**
 * "primary"   — filled blue button (default)
 * "secondary" — outline button, transparent background
 */
export type TCAButtonVariant = "primary" | "secondary";

interface TCAButtonProps {
  title: string;
  onPress: () => void;
  isValid?: boolean;
  variant?: TCAButtonVariant;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityState?: AccessibilityState;
  testID?: string;
}

export function TCAButton({
  title,
  onPress,
  isValid,
  variant = "primary",
  style,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  testID,
}: Readonly<TCAButtonProps>) {
  const isSecondary = variant === "secondary";

  return (
    <Pressable
      style={[
        styles.base,
        isSecondary ? styles.secondaryButton : styles.primaryButton,
        isValid === false && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={!isValid}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isValid, ...accessibilityState }}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      testID={testID}
    >
      <ThemedText
        style={[styles.buttonText, isSecondary && styles.secondaryButtonText]}
      >
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: AppColors.borderStrong,
  },
  disabledButton: { opacity: 0.4 },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.2,
  },
  secondaryButtonText: {
    color: AppColors.textPrimary,
  },
});
