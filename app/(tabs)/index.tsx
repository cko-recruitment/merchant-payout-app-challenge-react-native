import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BalanceCard } from '@/components/balance-card';
import { RecentActivity } from '@/components/recent-activity';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useMerchant } from '@/hooks/use-merchant';

export default function HomeScreen() {
  const { data: merchant, isLoading, isError } = useMerchant();

  const recentActivity = useMemo(() => {
    if (!merchant) return [];
    return [...merchant.activity]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, [merchant]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" accessibilityLabel="Loading merchant data" />
      </SafeAreaView>
    );
  }

  if (isError || !merchant) {
    return (
      <SafeAreaView style={styles.centered}>
        <ThemedText type="defaultSemiBold" style={styles.errorText}>
          Unable to load account data. Please try again.
        </ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Business Account</ThemedText>
        </ThemedView>
        <BalanceCard
          balance={merchant.available_balance}
          pending={merchant.pending_balance}
          currency={merchant.currency}
        />
        <RecentActivity items={recentActivity} />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  errorText: {
    color: '#EF4444',
  },
});
