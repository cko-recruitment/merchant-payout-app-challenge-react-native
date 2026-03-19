/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const AppColors = {
  // Core
  primary: "#007AFF",
  primaryDark: "#0062CC",
  success: "#34C759",
  error: "#FF3B30",
  warning: "#FF9500",
  info: "#5AC8FA",

  // Text
  textPrimary: "#11181C",
  textSecondary: "#666666",
  textTertiary: "#8E8E93",

  // Activity type colours
  typeDeposit: "#34C759",
  typePayout: "#007AFF",
  typeRefund: "#FF9500",
  typeFee: "#FF3B30",

  // Status colours
  statusCompleted: "#34C759",
  statusPending: "#FF9500",
  statusProcessing: "#007AFF",
  statusFailed: "#FF3B30",

  // Surfaces
  surfaceSecondary: "#E5E5EA",
  surfaceTertiary: "#F2F2F7",
  surfaceCard: "#FFFFFF",

  // Border
  border: "rgba(0,0,0,0.08)",
  borderStrong: "rgba(0,0,0,0.15)",
} as const;

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#052034",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export function typeColourScheme(type: string): string {
  const typeMap: Record<string, string> = {
    deposit: AppColors.typeDeposit,
    payout: AppColors.typePayout,
    refund: AppColors.typeRefund,
    fee: AppColors.typeFee,
  };

  return typeMap[type] ?? AppColors.textTertiary;
}

export function statusColourScheme(status: string): string {
  const statusMap: Record<string, string> = {
    completed: AppColors.statusCompleted,
    pending: AppColors.statusPending,
    processing: AppColors.statusProcessing,
    failed: AppColors.statusFailed,
  };

  return statusMap[status] ?? AppColors.textTertiary;
}

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
