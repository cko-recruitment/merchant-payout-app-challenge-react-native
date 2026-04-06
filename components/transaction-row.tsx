import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ActivityItem } from '@/types/api';
import { formatAmount } from '@/utils/currency';

export const TransactionRow = ({ item }: { item: ActivityItem }) => {
  const formattedDate = new Date(item.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <ThemedText type="label">{item.type}</ThemedText>
        <ThemedText type="default">{item.description}</ThemedText>
        <ThemedText type="caption">{formattedDate}</ThemedText>
      </View>
      <View style={styles.rowRight}>
        <ThemedText type="default" style={{ color: item.amount < 0 ? '#EF4444' : '#10B981' }}>
          {formatAmount(item.amount, item.currency)}
        </ThemedText>
        <ThemedText type="caption" style={styles.status}>
          {item.status}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  rowLeft: {
    flex: 1,
    gap: 2,
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  status: {
    textTransform: 'capitalize',
  },
});
