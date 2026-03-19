import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ThemedView } from "@/components/themed-view";
import { HeaderTitle } from "@/components/header-title";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AmountInput } from "../components/amount-input";
import { useState } from "react";
import { CurrencyDropdown } from "../components/dropdown";
import { IBANInput } from "../components/iban-inpurt";
import { TCAButton } from "../../../components/tca-button";
import { Currency, IbanSchema, PayoutResponse } from "@/types/api";
import { formatedCurrency } from "@/utils";
import { ConfirmModal } from "../components/confirm-modal";
import { usePayout } from "../hooks/use-payout";
import { PayoutSuccessView } from "../components/payout-success-view";
import { ErrorView } from "@/components/error-view";

const CURRENCY_LABEL = [
  { label: "GBP", value: "GBP" },
  { label: "EUR", value: "EUR" },
];

export function PayoutsScreen() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("GBP");
  const [iban, setIban] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [successData, setSuccessData] = useState<PayoutResponse | null>(null);

  const { t } = useTranslation();
  const { isLoading, error, submitPayout, reset } = usePayout();
  const insets = useSafeAreaInsets();

  const numAmount = Number.parseFloat(amount.replaceAll(",", "."));
  const isValidAmount = !Number.isNaN(numAmount) && numAmount > 0;

  const ibanNormalised = iban.trim().toUpperCase().replaceAll(/\s+/g, "");
  const ibanResult = IbanSchema.safeParse(ibanNormalised);
  const isValidIban = ibanResult.success;
  const ibanError =
    !ibanResult.success && iban.length > 0
      ? (ibanResult.error.issues[0]?.message ?? "Invalid IBAN")
      : null;

  const isValid = isValidAmount && isValidIban;

  const handleReview = () => {
    if (isValid) setIsConfirming(true);
  };

  const handleConfirm = async () => {
    try {
      const result = await submitPayout(numAmount, currency as Currency, iban);
      setIsConfirming(false);
      if (result) setSuccessData(result);
    } catch {
      setIsConfirming(false);
    }
  };

  const resetForm = () => {
    setAmount("");
    setCurrency("GBP");
    setIban("");
    setSuccessData(null);
    reset();
  };

  if (error) {
    return (
      <ErrorView
        title={t("payouts.payoutFailed")}
        message={error.message}
        onRetry={reset}
      />
    );
  }

  if (successData) {
    return (
      <PayoutSuccessView
        amount={successData.amount}
        currency={successData.currency}
        iban={iban}
        onNewPayout={resetForm}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      accessibilityRole="none"
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Payout form"
      >
        <ThemedView style={styles.container}>
          <HeaderTitle
            title={t("payouts.sendPayout")}
            accessibilityRole="header"
          />

          <ThemedView
            style={styles.amountContainer}
            accessibilityRole="none"
            importantForAccessibility="no-hide-descendants"
          >
            <ThemedView style={styles.inputContainer}>
              <AmountInput
                value={amount}
                onChange={setAmount}
                currency={currency as Currency}
                formattedPreview={
                  isValidAmount
                    ? formatedCurrency(
                        Math.round(numAmount * 100),
                        currency as Currency,
                      )
                    : undefined
                }
              />
            </ThemedView>

            <ThemedView style={styles.dropdownContainer}>
              <CurrencyDropdown
                value={currency}
                option={CURRENCY_LABEL}
                onChange={setCurrency}
              />
            </ThemedView>
          </ThemedView>

          <ThemedView
            style={[styles.inputContainer, styles.ibanInputContainer]}
            importantForAccessibility="no-hide-descendants"
          >
            <IBANInput value={iban} onChange={setIban} error={ibanError} />
          </ThemedView>
          <TCAButton
            title={t("payouts.sendMoney")}
            onPress={handleReview}
            isValid={isValid}
            accessibilityLabel={t("payouts.sendMoney")}
            accessibilityHint="Navigates to the confirmation screen"
          />
        </ThemedView>
      </ScrollView>

      <ConfirmModal
        visible={isConfirming}
        amount={isValidAmount ? Math.round(numAmount * 100) : 0}
        currency={currency as Currency}
        iban={iban}
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onCancel={() => setIsConfirming(false)}
        bottomInset={insets.bottom}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    //TODO: remove below
    //backgroundColor: "red",
  },
  inputContainer: {
    flex: 1,
  },
  dropdownContainer: {
    width: 100,
    marginLeft: 15,
  },
  ibanInputContainer: {
    marginTop: 50,
  },
});
