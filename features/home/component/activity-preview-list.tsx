import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ActivityItem } from "@/types/api";
import { TCAButton } from "@/components/tca-button";
import { RecentActivityListItem } from "@/features/recent-activity/component/recent-activity-list";

interface ActivityPreviewListProps {
  items?: ActivityItem[];
  numberOfItems?: number;
  seeAllAction?: () => void;
}

export function ActivityPreviewList({
  items,
  numberOfItems = 3,
  seeAllAction,
}: Readonly<ActivityPreviewListProps>) {
  const { t } = useTranslation();

  const generatePreviewItems = (count: number) => {
    if (!items || items.length === 0) {
      return (
        <ThemedView
          style={styles.emptyContainer}
          accessible={true}
          accessibilityLabel={t("home.noRecentActivity")}
        >
          <ThemedText type="defaultSemiBold" style={styles.emptyText}>
            {t("home.noRecentActivity")}
          </ThemedText>
        </ThemedView>
      );
    }

    const selectedItems = items.slice(0, count);
    return selectedItems.map((item, index) => (
      <RecentActivityListItem key={item.id || index} item={item} />
    ));
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText
          type="subtitle"
          style={styles.title}
          accessibilityRole="header"
        >
          {t("home.recentActivity")}
        </ThemedText>
      </View>
      <View style={styles.listContainer}>
        {generatePreviewItems(numberOfItems)}
      </View>
      <TCAButton
        title={t("home.seeAll")}
        onPress={seeAllAction || (() => {})}
        isValid={true}
        accessibilityHint="Opens the full transaction history"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    marginTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  seeAllButton: {
    height: 32,
    paddingHorizontal: 12,
  },
  listContainer: {
    overflow: "hidden",
    marginBottom: 15,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    opacity: 0.5,
  },
});
