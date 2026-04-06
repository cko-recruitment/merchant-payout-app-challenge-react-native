import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ActivityRow } from '@/components/activity-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ActivityItem } from '@/types/api';

interface RecentActivityProps {
  items: ActivityItem[];
}

export const RecentActivity = ({ items }: RecentActivityProps) => {
  const router = useRouter();

  return (
    <ThemedView style={styles.section}>
      <ThemedText type="subtitle">Recent Activity</ThemedText>
      {items.length === 0 ? (
        <ThemedText type="caption" style={styles.empty}>
          No recent activity
        </ThemedText>
      ) : (
        items.map((item) => <ActivityRow key={item.id} {...item} />)
      )}
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => router.push('/modal')}
        accessibilityRole="button"
        accessibilityLabel="Show all transactions"
      >
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          Show more
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  empty: {
    paddingVertical: 12,
  },
  button: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
  },
});
