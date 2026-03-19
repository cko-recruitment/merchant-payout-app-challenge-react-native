import { ThemedText } from "@/components/themed-text";
import { typeColourScheme } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

interface TypeBadgeProps {
    type: string;
}

export function TypeBadge({ type }: Readonly<TypeBadgeProps>) {
    const typeColor = typeColourScheme(type);
    
    return (
          <View style={[styles.typeBadge, { backgroundColor: `${typeColor}18` }]}>
            <ThemedText style={[styles.typeBadgeText, { color: typeColor }]}>
              {type.toUpperCase()}
            </ThemedText>
          </View>
    );
}

const styles = StyleSheet.create({
    typeBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
  },
    typeBadge: {
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 6,
  },
});