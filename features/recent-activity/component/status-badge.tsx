import { ThemedText } from "@/components/themed-text";
import { statusColourScheme } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

interface StatusBadgeProps {
    status: string;
}

export function StatusBadge({ status }: Readonly<StatusBadgeProps>) {
    const typeColor = statusColourScheme(status);
    
    return (
          <View style={[styles.statusBadge, { backgroundColor: `${typeColor}18` }]}>
            <ThemedText style={[styles.statusText, { color: typeColor }]}>
              {status}
            </ThemedText>
          </View>
    );
}

const styles = StyleSheet.create({
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
});