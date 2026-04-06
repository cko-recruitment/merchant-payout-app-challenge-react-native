import { ThemedView } from '@/components/themed-view';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { formatAmount } from '@/utils/currency';
import { Currency } from '@/types/api';

interface BalanceCardProps {
  balance: number;
  pending: number;
  currency: Currency;
}

export const BalanceCard = ({ balance, pending, currency }: BalanceCardProps) => {
  return (
    <ThemedView style={styles.card}>
      <ThemedText style={styles.cardLabel}>Account Balance</ThemedText>
      <ThemedText type="title" style={styles.availableBalance}>
        {formatAmount(balance, currency)}
      </ThemedText>
      <View style={styles.pendingRow}>
        <ThemedText style={styles.pendingLabel}>Pending</ThemedText>
        <ThemedText style={styles.pendingAmount}>{formatAmount(pending, currency)}</ThemedText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardLabel: {
    fontSize: 13,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  availableBalance: {
    marginBottom: 8,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pendingLabel: {
    fontSize: 13,
    color: '#888',
  },
  pendingAmount: {
    fontSize: 13,
    color: '#F59E0B',
    fontWeight: '600',
  },
});
