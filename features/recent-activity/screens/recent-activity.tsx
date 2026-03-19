import { StyleSheet, FlatList, View, Pressable, Platform } from "react-native";
import { useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderTitle } from "@/components/header-title";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRecentActivity } from "../hooks/useRecentActivity";
import { RecentActivityListItem } from "../component/recent-activity-list";
import { Loading } from "@/components/loading";
import { ErrorView } from "@/components/error-view";
import { AppRoute, useCoordinator } from "@/coordinator/useCoordinator";
import { useTranslation } from "react-i18next";
import { ActivityListFooter } from "../component/activity-list-footer";
import { AppColors } from "@/constants/theme";

export function RecentActivity() {
  const coordinator = useCoordinator();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { items, loading, loadingMore, hasMore, error, fetchMore } =
    useRecentActivity();

  const renderItem = useCallback(
    ({ item }: { item: (typeof items)[number] }) => (
      <RecentActivityListItem item={item} />
    ),
    [],
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorView
        title="Error"
        message="Failed to load recent activity"
        onRetry={fetchMore}
      />
    );
  }

  return (
    <View
      style={[
        styles.mainContainer,
        { paddingTop: Platform.OS === "android" ? insets.top : 0 },
      ]}
      accessibilityRole="none"
    >
      <View style={styles.header} accessibilityRole="header">
        <HeaderTitle
          title={t("activity.allTransactions")}
          importantForAccessibility="yes"
        />
        <Pressable
          onPress={() => {
            coordinator.navigateTo(AppRoute.Cancel);
          }}
          hitSlop={20}
          accessibilityRole="button"
          accessibilityLabel={t("activity.done")}
          accessibilityHint="Closes the activity history"
        >
          <ThemedText style={styles.done} type="link">
            {t("activity.done")}
          </ThemedText>
        </Pressable>
      </View>

      <ThemedView style={styles.container}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onEndReached={fetchMore}
          onEndReachedThreshold={1}
          ListFooterComponent={<ActivityListFooter loadingMore={loadingMore} />}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: (insets.bottom || 20) + 20 },
          ]}
          accessibilityLabel="Transaction history list"
        />
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.border,
  },
  done: {
    fontWeight: "bold",
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
});
