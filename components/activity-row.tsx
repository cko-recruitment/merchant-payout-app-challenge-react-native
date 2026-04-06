import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ActivityItem } from '@/types/api';
import { formatAmount } from '@/utils/currency';

export const ActivityRow = ({ description, amount, currency }: ActivityItem) => (
  <>
    <View style={styles.row}>
      <ThemedText type="default">{description}</ThemedText>
      <ThemedText style={{ color: amount < 0 ? '#EF4444' : '#10B981' }}>
        {formatAmount(amount, currency)}
      </ThemedText>
    </View>
    <View style={styles.separator} />
  </>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
});
