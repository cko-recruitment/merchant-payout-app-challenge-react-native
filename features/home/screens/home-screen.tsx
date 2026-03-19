import { ThemedView } from "@/components/themed-view";
import { useMerchantData } from "@/hooks/use-merchant-data";
import { StyleSheet, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

import { Loading } from "@/components/loading";
import { ErrorView } from "@/components/error-view";
import { HeaderTitle } from "@/components/header-title";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BalanceCard } from "../component/balance-card";
import { ActivityPreviewList } from "../component/activity-preview-list";
import { AppRoute, useCoordinator } from "@/coordinator/useCoordinator";

export function HomeScreen() {
  const { data, loading, error, refetch } = useMerchantData();
  const insets = useSafeAreaInsets();
  const coordinator = useCoordinator();
  const { t } = useTranslation();

  if (loading) {
    return <Loading />;
  }

  if (error || !data) {
    return (
      <ErrorView
        title={t("error.title")}
        message={t("error.message")}
        onRetry={refetch}
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
        ]}
        accessibilityLabel="Home screen"
      >
        <HeaderTitle title={t("home.businessAccount")} />
        <BalanceCard
          balance={data.available_balance}
          pendingBalance={data.pending_balance}
          currency={data.currency}
        />

        <ActivityPreviewList
          items={data.activity}
          seeAllAction={() => {
            coordinator.navigateTo(AppRoute.TransactionHistoryModal);
          }}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  scrollContainer: {
    paddingHorizontal: 8,
  },
});
