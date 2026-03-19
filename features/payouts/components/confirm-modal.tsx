import { Modal, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemedText } from "@/components/themed-text";
import { TCAButton } from "@/components/tca-button";
import { formatedCurrency } from "@/utils";
import { AppColors } from "@/constants/theme";
import type { Currency } from "@/types/api";
import { SummaryRow } from "./summary-row";

interface ConfirmModalProps {
  visible: boolean;
  /** Amount in pence / cents (lowest denomination). */
  amount: number;
  currency: Currency;
  iban: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  bottomInset?: number;
}

export function ConfirmModal({
  visible,
  amount,
  currency,
  iban,
  isLoading,
  onConfirm,
  onCancel,
  bottomInset = 0,
}: Readonly<ConfirmModalProps>) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      // iOS VoiceOver: traps focus inside the modal when open
      accessibilityViewIsModal
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalSheet, { paddingBottom: bottomInset + 16 }]}>
          <View style={styles.dragHandle} />

          <ThemedText style={styles.modalTitle}>
            {t("payouts.reviewAndConfirm")}
          </ThemedText>
          <ThemedText style={styles.modalSubtitle}>
            Please verify the payout details below.
          </ThemedText>

          <View style={styles.summaryBox}>
            <SummaryRow
              label={t("payouts.amount")}
              value={formatedCurrency(amount, currency)}
            />
            <View style={styles.summaryDivider} />
            <SummaryRow label={t("payouts.currency")} value={currency} />
            <View style={styles.summaryDivider} />
            <SummaryRow
              label={t("payouts.toIban")}
              value={iban}
              valueStyle={styles.summaryIban}
              numberOfLines={1}
            />
          </View>

          <View style={styles.modalActions}>
            <TCAButton
              style={styles.flex1}
              variant="secondary"
              title={t("payouts.cancel")}
              onPress={onCancel}
              isValid={!isLoading}
              testID="modal-cancel"
              accessibilityHint="Dismisses this confirmation sheet without sending the payout"
            />

            <View style={styles.buttonGap} />

            <TCAButton
              style={styles.flex1}
              title={isLoading ? t("payouts.processing") : t("payouts.confirm")}
              onPress={onConfirm}
              isValid={!isLoading}
              testID="modal-confirm"
              accessibilityState={{ disabled: isLoading, busy: isLoading }}
              accessibilityHint={
                isLoading ? undefined : "Sends the payout to the specified IBAN"
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  buttonGap: { width: 12 },
  modalActions: {
    flexDirection: "row",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: AppColors.surfaceCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: AppColors.surfaceSecondary,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  modalSubtitle: {
    color: AppColors.textSecondary,
    fontSize: 14,
    marginBottom: 24,
  },
  summaryBox: {
    backgroundColor: AppColors.surfaceTertiary,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: AppColors.border,
    marginVertical: 4,
  },
  summaryValue: {
    fontWeight: "600",
    fontSize: 14,
    maxWidth: "60%",
    textAlign: "right",
  },
  summaryIban: {
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
});
